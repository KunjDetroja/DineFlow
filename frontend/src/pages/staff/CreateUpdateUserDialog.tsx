import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
} from "@/store/services/user.service";
import { useGetAllRestaurantsQuery } from "@/store/services/restaurant.service";
import { useGetAllOutletsQuery } from "@/store/services/outlet.service";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  createUserSchema,
  updateUserSchema,
  CreateUserFormData,
  UpdateUserFormData,
} from "@/validator/user.validator";
import { ROLES, OWNER, MANAGER, CHEF, WAITER, ADMIN } from "@/utils/constant";
import { RootState } from "@/store";

// Form data type that includes all possible fields for type safety
interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  restaurantId?: string;
  outletId?: string;
  isActive?: boolean;
  password?: string;
}

interface CreateUpdateUserDialogProps {
  userId?: string; // If provided, it's update mode; if not, it's create mode
  onClose: () => void;
}

const CreateUpdateUserDialog = ({
  userId,
  onClose,
}: CreateUpdateUserDialogProps) => {
  const isUpdateMode = Boolean(userId);

  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.user.data);
  console.log("currentUser", currentUser);
  const currentUserRole = currentUser?.role;
  const currentUserRestaurantId = currentUser?.restaurant?._id
  const currentUserOutletId = currentUser?.outlet?._id

  const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery(
    userId!,
    {
      skip: !isUpdateMode,
    }
  );
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const { data: restaurantsData } = useGetAllRestaurantsQuery({}, {
    skip: currentUserRole !== ADMIN
  });
  const { data: outletsData } = useGetAllOutletsQuery({}, {
    skip: ![ADMIN, OWNER].includes(currentUserRole as string)
  });

  const restaurants = restaurantsData?.data?.data || [];
  const outlets = outletsData?.data?.data || [];

  const user = userData?.data;
  const isLoading = isUpdating || isCreating;

  // Form setup with proper typing
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(isUpdateMode ? updateUserSchema : createUserSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      restaurantId: "",
      outletId: "",
      isActive: true,
      ...(isUpdateMode ? {} : { password: "" }),
    },
  });

  // Role hierarchy: ADMIN > OWNER > MANAGER > OTHER
  const getRoleHierarchy = (role: string): number => {
    switch (role) {
      case ADMIN:
        return 4;
      case OWNER:
        return 3;
      case MANAGER:
        return 2;
      default:
        return 1; // CHEF, WAITER, etc.
    }
  };

  // Get allowed roles based on current user's role
  const getAllowedRoles = (): string[] => {
    if (!currentUserRole) return [];

    const currentHierarchy = getRoleHierarchy(currentUserRole);

    return ROLES.filter((role) => {
      if (role === "CUSTOMER") return false; // Never allow creating customers
      if (role === ADMIN) return false; // Never allow creating ADMIN users

      const roleHierarchy = getRoleHierarchy(role);
      return roleHierarchy <= currentHierarchy;
    });
  };

  const allowedRoles = getAllowedRoles();

  // Determine if restaurant/outlet fields should be shown based on current user role
  const shouldShowRestaurantField = (selectedRole?: string): boolean => {
    if (!selectedRole) return false;

    // ADMIN can select any restaurant
    if (currentUserRole === ADMIN) {
      return [OWNER, MANAGER, CHEF, WAITER].includes(selectedRole);
    }

    // OWNER and MANAGER use their own restaurant/outlet, so no selection needed
    return false;
  };

  const shouldShowOutletField = (selectedRole?: string): boolean => {
    if (!selectedRole) return false;

    // ADMIN can select any outlet for MANAGER, CHEF, WAITER
    if (currentUserRole === ADMIN) {
      return [MANAGER, CHEF, WAITER].includes(selectedRole);
    }

    // OWNER can select outlet for MANAGER, CHEF, WAITER
    if (currentUserRole === OWNER) {
      return [MANAGER, CHEF, WAITER].includes(selectedRole);
    }

    // MANAGER uses their own outlet, so no selection needed
    return false;
  };

  useEffect(() => {
    if (isUpdateMode && user) {
      const restaurantId = user.restaurant?._id
      const outletId = user.outlet?._id

      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        restaurantId,
        outletId,
        isActive: user.isActive,
      });
    }
  }, [user, reset, isUpdateMode]);

  // Auto-set restaurant and outlet IDs based on current user role and selected role
  const selectedRole = watch("role");
  useEffect(() => {
    if (!isUpdateMode && selectedRole) {
      const updates: any = {};

      // Set restaurant ID based on current user role
      if (currentUserRole === OWNER || currentUserRole === MANAGER) {
        if ([OWNER, MANAGER, CHEF, WAITER].includes(selectedRole)) {
          updates.restaurantId = currentUserRestaurantId || "";
        }
      }

      // Set outlet ID based on current user role
      if (currentUserRole === MANAGER) {
        if ([MANAGER, CHEF, WAITER].includes(selectedRole)) {
          updates.outletId = currentUserOutletId || "";
        }
      }

      // Apply updates if any
      if (Object.keys(updates).length > 0) {
        Object.entries(updates).forEach(([key, value]) => {
          reset((prev) => ({ ...prev, [key]: value }));
        });
      }
    }
  }, [
    selectedRole,
    currentUserRole,
    currentUserRestaurantId,
    currentUserOutletId,
    isUpdateMode,
    reset,
  ]);

  const onSubmit = async (data: FormData) => {
    // Validate role hierarchy
    if (!isUpdateMode && data.role && !allowedRoles.includes(data.role)) {
      toast.error("You don't have permission to create this role");
      return;
    }

    // Auto-set restaurant and outlet IDs based on current user role
    if (!isUpdateMode) {
      // If current user is OWNER or MANAGER, set their restaurant ID
      if (
        (currentUserRole === OWNER || currentUserRole === MANAGER) &&
        [OWNER, MANAGER, CHEF, WAITER].includes(data.role)
      ) {
        data.restaurantId = currentUserRestaurantId;
      }

      // If current user is MANAGER, set their outlet ID for lower roles
      if (
        currentUserRole === MANAGER &&
        [MANAGER, CHEF, WAITER].includes(data.role)
      ) {
        data.outletId = currentUserOutletId;
      }
    }

    // Remove empty string values from data
    const cleanedData = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(data).filter(([_, value]) => value !== "")
    );

    // If role is OWNER, remove outletId as it's not needed
    if (cleanedData.role === OWNER) {
      delete cleanedData.outletId;
    }

    try {
      if (isUpdateMode) {
        await updateUser({
          id: userId!,
          data: cleanedData as UpdateUserFormData,
        }).unwrap();
        toast.success("Staff member updated successfully");
      } else {
        await createUser(cleanedData as CreateUserFormData).unwrap();
        toast.success("Staff member created successfully");
      }
      reset();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
        `Failed to ${isUpdateMode ? "update" : "create"} staff member`
      );
    }
  };

  if (isUpdateMode && isLoadingUser) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Update Staff Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (isUpdateMode && !user) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Update Staff Member</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-center text-muted-foreground">User not found</p>
        </div>
      </>
    );
  }

  // Determine which fields to show based on current user role and selected role
  const showRestaurantField = shouldShowRestaurantField(selectedRole);
  const showOutletField = shouldShowOutletField(selectedRole);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isUpdateMode ? "Update Staff Member" : "Add New Staff Member"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter full name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Enter email address"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="Enter phone number"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Password - Only show in create mode */}
        {!isUpdateMode && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter password"
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
        )}

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {allowedRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && (
            <p className="text-sm text-red-500">{errors.role.message}</p>
          )}
          {!isUpdateMode && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                As a {currentUserRole}, you can create:{" "}
                {allowedRoles.join(", ")}
              </p>
              {(currentUserRole === OWNER || currentUserRole === MANAGER) && (
                <p className="text-xs text-blue-600">
                  Restaurant and outlet will be automatically assigned based on
                  your access
                </p>
              )}
            </div>
          )}
        </div>

        {/* Restaurant - Only show for ADMIN */}
        {showRestaurantField && (
          <div className="space-y-2">
            <Label htmlFor="restaurantId">Restaurant</Label>
            <Controller
              name="restaurantId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={errors.restaurantId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select restaurant" />
                  </SelectTrigger>
                  <SelectContent>
                    {restaurants.map((restaurant) => (
                      <SelectItem key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.restaurantId && (
              <p className="text-sm text-red-500">
                {errors.restaurantId.message}
              </p>
            )}
          </div>
        )}

        {/* Show restaurant info when it's auto-assigned */}
        {!showRestaurantField &&
          selectedRole &&
          [OWNER, MANAGER, CHEF, WAITER].includes(selectedRole) &&
          (currentUserRole === OWNER || currentUserRole === MANAGER) && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                <strong>Restaurant:</strong> Will be automatically assigned to
                your restaurant
              </p>
            </div>
          )}

        {/* Outlet - Only show for ADMIN and OWNER */}
        {showOutletField && (
          <div className="space-y-2">
            <Label htmlFor="outletId">Outlet</Label>
            <Controller
              name="outletId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={errors.outletId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select outlet" />
                  </SelectTrigger>
                  <SelectContent>
                    {outlets.map((outlet) => (
                      <SelectItem key={outlet._id} value={outlet._id}>
                        {outlet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.outletId && (
              <p className="text-sm text-red-500">{errors.outletId.message}</p>
            )}
          </div>
        )}

        {/* Show outlet info when it's auto-assigned */}
        {!showOutletField &&
          selectedRole &&
          [MANAGER, CHEF, WAITER].includes(selectedRole) &&
          currentUserRole === MANAGER && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                <strong>Outlet:</strong> Will be automatically assigned to your
                outlet
              </p>
            </div>
          )}

        {/* Show note when OWNER is selected */}
        {selectedRole === OWNER && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Owners have access to all outlets within
              their restaurant, so outlet selection is not required.
            </p>
          </div>
        )}

        {/* Active Status - Only show in update mode */}
        {isUpdateMode && (
          <div className="flex items-center space-x-2">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="isActive"
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="isActive">Active Status</Label>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isUpdateMode
                ? "Updating..."
                : "Creating..."
              : isUpdateMode
                ? "Update Staff Member"
                : "Create Staff Member"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default CreateUpdateUserDialog;
