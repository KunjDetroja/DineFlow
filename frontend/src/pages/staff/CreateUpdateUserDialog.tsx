import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
} from "@/store/services/user.service";
import { useGetAllRestaurantsQuery } from "@/store/services/restaurant.service";
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
import { ROLES, OWNER, MANAGER, CHEF, WAITER } from "@/utils/constant";

interface CreateUpdateUserDialogProps {
  userId?: string; // If provided, it's update mode; if not, it's create mode
  onClose: () => void;
}

const CreateUpdateUserDialog = ({
  userId,
  onClose,
}: CreateUpdateUserDialogProps) => {
  const isUpdateMode = Boolean(userId);

  const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery(
    userId!,
    {
      skip: !isUpdateMode,
    }
  );
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const { data: restaurantsData } = useGetAllRestaurantsQuery({});
  const restaurants = restaurantsData?.data?.data || [];

  const user = userData?.data;
  const isLoading = isUpdating || isCreating;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control,
  } = useForm({
    resolver: zodResolver(isUpdateMode ? updateUserSchema : createUserSchema),
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

  // Mock outlets data - in real app, you'd fetch this based on selected restaurant
  const outlets = [
    { _id: "1", name: "Main Branch" },
    { _id: "2", name: "Downtown Branch" },
  ];
  useEffect(() => {
    if (isUpdateMode && user) {
      const restaurantId =
        typeof user.restaurantId === "object" && user.restaurantId
          ? user.restaurantId._id
          : user.restaurantId;
      const outletId =
        typeof user.outletId === "object" && user.outletId
          ? user.outletId._id
          : user.outletId;

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

  const onSubmit = async (data: any) => {
    try {
      if (isUpdateMode) {
        await updateUser({
          id: userId!,
          data: data as UpdateUserFormData,
        }).unwrap();
        toast.success("Staff member updated successfully");
      } else {
        await createUser(data as CreateUserFormData).unwrap();
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
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
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

  const selectedRole = watch("role");
  const requiresOutlet = selectedRole
    ? [MANAGER, CHEF, WAITER].includes(selectedRole)
    : false;
  const requiresRestaurant = selectedRole
    ? [OWNER, MANAGER, CHEF, WAITER].includes(selectedRole)
    : false;

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
              <p className="text-sm text-red-500">{errors.password.message}</p>
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
                  {ROLES.filter((role) => role !== "CUSTOMER").map((role) => (
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
        </div>

        {/* Restaurant - Required for OWNER, MANAGER, CHEF, WAITER */}
        {requiresRestaurant && (
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

        {/* Outlet - Required for MANAGER, CHEF, WAITER */}
        {requiresOutlet && watch("restaurantId") && (
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

        {/* Active Status - Only show in update mode */}
        {isUpdateMode && (
          <div className="flex items-center space-x-2">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="isActive"
                  checked={field.value}
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
