import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Building, MapPin, Phone } from "lucide-react";
import { useCreateOutletMutation } from "@/store/services/outlet.service";
import { useGetAllRestaurantsQuery } from "@/store/services/restaurant.service";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  createOutletSchemaAdmin,
  createOutletSchemaOwner,
  CreateOutletFormDataAdmin,
  CreateOutletFormDataOwner,
} from "@/validator/outlet.validator";

interface CreateOutletDialogProps {
  onClose: () => void;
}

const CreateOutletDialog: React.FC<CreateOutletDialogProps> = ({ onClose }) => {
  const [createOutlet, { isLoading }] = useCreateOutletMutation();
  const user = useSelector((state: RootState) => state.user.data);
  const isAdmin = user?.role === "ADMIN";

  // Only fetch restaurants if user is admin
  const { data: restaurantsData } = useGetAllRestaurantsQuery(
    { limit: 1000 }, // Get all restaurants for dropdown
    { skip: !isAdmin }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateOutletFormDataAdmin | CreateOutletFormDataOwner>({
    resolver: zodResolver(
      isAdmin ? createOutletSchemaAdmin : createOutletSchemaOwner
    ),
    defaultValues: {
      restaurantId: "",
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      phone: "",
    },
  });

  const onSubmit = async (
    data: CreateOutletFormDataAdmin | CreateOutletFormDataOwner
  ) => {
    try {
      // Clean up phone field if empty
      const cleanedData = {
        ...data,
        phone: data.phone?.trim() || undefined,
        // Remove restaurantId if user is owner (backend will use user's restaurantId)
        ...(isAdmin ? {} : { restaurantId: undefined }),
      };

      const response = await createOutlet(cleanedData).unwrap();

      if (response.success) {
        toast.success(response.message || "Outlet created successfully");
        reset();
        onClose();
      } else {
        toast.error(response.message || "Failed to create outlet");
      }
    } catch (error: any) {
      console.error("Error creating outlet:", error);
      const errorMessage = error?.data?.message || "Failed to create outlet";
      toast.error(errorMessage);
    }
  };

  const restaurants = restaurantsData?.data?.data || [];

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Create New Outlet
        </DialogTitle>
        <DialogDescription>
          {isAdmin
            ? "Add a new outlet location. Select a restaurant and provide the outlet details."
            : "Add a new outlet location for your restaurant."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Restaurant Selection (Admin only) */}
        {isAdmin && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Building className="h-4 w-4" />
              Restaurant Selection
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantId">Select Restaurant *</Label>
              <Controller
                name="restaurantId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={restaurants.length === 0}
                  >
                    <SelectTrigger
                      className={errors.restaurantId ? "border-red-500" : ""}
                    >
                      <SelectValue
                        placeholder={
                          restaurants.length === 0
                            ? "No restaurants available"
                            : "Choose a restaurant for this outlet"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants.map((restaurant) => (
                        <SelectItem key={restaurant._id} value={restaurant._id}>
                          <div className="flex items-center gap-2">
                            {restaurant.logo ? (
                              <img
                                src={restaurant.logo}
                                alt={restaurant.name}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                            ) : (
                              <Building className="w-4 h-4 text-gray-400" />
                            )}
                            {restaurant.name}
                          </div>
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
              {restaurants.length === 0 && (
                <p className="text-sm text-amber-600">
                  No restaurants found. Please create a restaurant first.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Outlet Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Building className="h-4 w-4" />
            Outlet Information
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Outlet Name *</Label>
            <Input
              id="name"
              placeholder="Enter outlet name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <MapPin className="h-4 w-4" />
            Address Information
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              placeholder="Enter street address"
              {...register("address")}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Enter city"
                {...register("city")}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                placeholder="Enter state"
                {...register("state")}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && (
                <p className="text-sm text-red-500">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                placeholder="Enter country"
                {...register("country")}
                className={errors.country ? "border-red-500" : ""}
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                placeholder="Enter pincode"
                {...register("pincode")}
                className={errors.pincode ? "border-red-500" : ""}
              />
              {errors.pincode && (
                <p className="text-sm text-red-500">{errors.pincode.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || (isAdmin && restaurants.length === 0)}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Outlet"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateOutletDialog;
