import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Building2, Image } from "lucide-react";
import { 
  useUpdateRestaurantMutation,
  useGetRestaurantByIdQuery 
} from "@/store/services/restaurant.service";
import {
  updateRestaurantSchema,
  UpdateRestaurantFormData,
} from "@/validator/restaurant.validator";

interface UpdateRestaurantDialogProps {
  restaurantId: string;
  onClose: () => void;
}

const UpdateRestaurantDialog: React.FC<UpdateRestaurantDialogProps> = ({
  restaurantId,
  onClose,
}) => {
  const { data: restaurantData, isLoading: isLoadingRestaurant } = 
    useGetRestaurantByIdQuery(restaurantId);
  const [updateRestaurant, { isLoading: isUpdating }] = useUpdateRestaurantMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateRestaurantFormData>({
    resolver: zodResolver(updateRestaurantSchema),
    defaultValues: {
      name: "",
      logo: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  // Populate form when restaurant data is loaded
  useEffect(() => {
    if (restaurantData?.data) {
      const restaurant = restaurantData.data;
      reset({
        name: restaurant.name,
        logo: restaurant.logo || "",
        isActive: restaurant.isActive,
      });
    }
  }, [restaurantData, reset]);

  const onSubmit = async (data: UpdateRestaurantFormData) => {
    try {
      // Clean up logo field if empty
      const cleanedData = {
        ...data,
        logo: data.logo?.trim() || undefined,
      };

      const response = await updateRestaurant({
        id: restaurantId,
        data: cleanedData,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Restaurant updated successfully");
        onClose();
      } else {
        toast.error(response.message || "Failed to update restaurant");
      }
    } catch (error: any) {
      console.error("Error updating restaurant:", error);
      const errorMessage =
        error?.data?.message || "Failed to update restaurant";
      toast.error(errorMessage);
    }
  };

  if (isLoadingRestaurant) {
    return (
      <div className="space-y-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Update Restaurant
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Update Restaurant
        </DialogTitle>
        <DialogDescription>
          Update restaurant information and settings.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Restaurant Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name *</Label>
            <Input
              id="name"
              placeholder="Enter restaurant name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Logo URL (Optional)
            </Label>
            <Input
              id="logo"
              placeholder="https://example.com/logo.png"
              {...register("logo")}
              className={errors.logo ? "border-red-500" : ""}
            />
            {errors.logo && (
              <p className="text-sm text-red-500">{errors.logo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActive" className="flex items-center gap-2">
              Active Status
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue("isActive", checked)}
              />
              <Label htmlFor="isActive" className="text-sm">
                {isActive ? "Active" : "Inactive"}
              </Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Restaurant"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRestaurantDialog;