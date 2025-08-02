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
import { Loader2, Building, MapPin, Phone } from "lucide-react";
import {
  useGetOutletByIdQuery,
  useUpdateOutletMutation,
} from "@/store/services/outlet.service";
import {
  updateOutletSchema,
  UpdateOutletFormData,
} from "@/validator/outlet.validator";

interface UpdateOutletDialogProps {
  outletId: string;
  onClose: () => void;
}

const UpdateOutletDialog: React.FC<UpdateOutletDialogProps> = ({
  outletId,
  onClose,
}) => {
  const { data: outletData, isLoading: isLoadingOutlet } =
    useGetOutletByIdQuery(outletId);
  const [updateOutlet, { isLoading: isUpdating }] = useUpdateOutletMutation();

  const outlet = outletData?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateOutletFormData>({
    resolver: zodResolver(updateOutletSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      phone: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  // Populate form when outlet data is loaded
  useEffect(() => {
    if (outlet) {
      reset({
        name: outlet.name,
        address: outlet.address,
        city: outlet.city,
        state: outlet.state,
        country: outlet.country,
        pincode: outlet.pincode,
        phone: outlet.phone || "",
        isActive: outlet.isActive,
      });
    }
  }, [outlet, reset]);

  const onSubmit = async (data: UpdateOutletFormData) => {
    try {
      // Clean up phone field if empty
      const cleanedData = {
        ...data,
        phone: data.phone?.trim() || undefined,
      };

      const response = await updateOutlet({
        id: outletId,
        data: cleanedData,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Outlet updated successfully");
        onClose();
      } else {
        toast.error(response.message || "Failed to update outlet");
      }
    } catch (error: any) {
      console.error("Error updating outlet:", error);
      const errorMessage = error?.data?.message || "Failed to update outlet";
      toast.error(errorMessage);
    }
  };

  if (isLoadingOutlet) {
    return (
      <div className="space-y-6">
        <DialogHeader>
          <DialogTitle>Update Outlet</DialogTitle>
          <DialogDescription>Loading outlet information...</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!outlet) {
    return (
      <div className="space-y-6">
        <DialogHeader>
          <DialogTitle>Update Outlet</DialogTitle>
          <DialogDescription>Outlet not found.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  const restaurantName =
    typeof outlet.restaurantId === "object"
      ? outlet.restaurantId.name
      : "Unknown Restaurant";

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Update Outlet
        </DialogTitle>
        <DialogDescription>
          Update outlet information for {restaurantName}.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
            <Label htmlFor="isActive">Active</Label>
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
              "Update Outlet"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOutletDialog;
