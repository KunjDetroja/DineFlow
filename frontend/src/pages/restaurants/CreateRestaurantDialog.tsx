import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Building2, User, Mail, Phone, Image, ArrowRight, ArrowLeft } from "lucide-react";
import { useCreateRestaurantMutation } from "@/store/services/restaurant.service";
import {
  restaurantStepSchema,
  ownerStepSchema,
  RestaurantStepData,
  OwnerStepData,
} from "@/validator/restaurant.validator";

interface CreateRestaurantDialogProps {
  onClose: () => void;
}

// Step 1 Component - Restaurant Information
const RestaurantStep: React.FC<{
  onNext: (data: RestaurantStepData) => void;
  onCancel: () => void;
  initialData?: RestaurantStepData;
}> = ({ onNext, onCancel, initialData }) => {
  const form = useForm<RestaurantStepData>({
    resolver: zodResolver(restaurantStepSchema),
    defaultValues: initialData || {
      name: "",
      logo: "",
    },
  });

  const onSubmit = (data: RestaurantStepData) => {
    onNext(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Building2 className="h-4 w-4" />
          Restaurant Information
        </div>

        <div className="space-y-2">
          <Label htmlFor="restaurant-name">Restaurant Name *</Label>
          <Input
            id="restaurant-name"
            placeholder="Enter restaurant name"
            {...form.register("name")}
            className={form.formState.errors.name ? "border-red-500" : ""}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="restaurant-logo" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Logo URL (Optional)
          </Label>
          <Input
            id="restaurant-logo"
            placeholder="https://example.com/logo.png"
            {...form.register("logo")}
            className={form.formState.errors.logo ? "border-red-500" : ""}
          />
          {form.formState.errors.logo && (
            <p className="text-sm text-red-500">
              {form.formState.errors.logo.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Next Step
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  );
};

// Step 2 Component - Owner Information
const OwnerStep: React.FC<{
  onSubmit: (data: OwnerStepData) => void;
  onBack: () => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ onSubmit, onBack, onCancel, isLoading }) => {
  const form = useForm<OwnerStepData>({
    resolver: zodResolver(ownerStepSchema),
    defaultValues: {
      ownerName: "",
      email: "",
      phone: "",
    },
  });

  const handleSubmit = (data: OwnerStepData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <User className="h-4 w-4" />
          Owner Information
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner-name">Owner Name *</Label>
          <Input
            id="owner-name"
            placeholder="Enter owner's full name"
            {...form.register("ownerName")}
            className={form.formState.errors.ownerName ? "border-red-500" : ""}
          />
          {form.formState.errors.ownerName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.ownerName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner-email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address *
          </Label>
          <Input
            id="owner-email"
            type="email"
            placeholder="owner@restaurant.com"
            {...form.register("email")}
            className={form.formState.errors.email ? "border-red-500" : ""}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner-phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number *
          </Label>
          <Input
            id="owner-phone"
            placeholder="+1 (555) 123-4567"
            {...form.register("phone")}
            className={form.formState.errors.phone ? "border-red-500" : ""}
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-500">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Restaurant"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

// Main Component
const CreateRestaurantDialog: React.FC<CreateRestaurantDialogProps> = ({
  onClose,
}) => {
  const [createRestaurant, { isLoading }] = useCreateRestaurantMutation();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [restaurantData, setRestaurantData] = useState<RestaurantStepData | null>(null);

  const handleRestaurantNext = (data: RestaurantStepData) => {
    console.log('Restaurant form submitted:', data);
    setRestaurantData(data);
    setCurrentStep(2);
  };

  const handleOwnerSubmit = async (ownerData: OwnerStepData) => {
    if (!restaurantData) return;

    try {
      // Clean up logo field if empty and map owner data to API format
      const cleanedData = {
        restaurant: {
          ...restaurantData,
          logo: restaurantData.logo?.trim() || undefined,
        },
        user: {
          name: ownerData.ownerName,
          email: ownerData.email,
          phone: ownerData.phone,
        },
      };

      const response = await createRestaurant(cleanedData).unwrap();

      if (response.success) {
        toast.success(response.message || "Restaurant created successfully");
        setRestaurantData(null);
        setCurrentStep(1);
        onClose();
      } else {
        toast.error(response.message || "Failed to create restaurant");
      }
    } catch (error: any) {
      console.error("Error creating restaurant:", error);
      const errorMessage =
        error?.data?.message || "Failed to create restaurant";
      toast.error(errorMessage);
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleCancel = () => {
    setRestaurantData(null);
    setCurrentStep(1);
    onClose();
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Create New Restaurant
        </DialogTitle>
        <DialogDescription>
          {currentStep === 1
            ? "Step 1 of 2: Enter restaurant information"
            : "Step 2 of 2: Enter owner information and create account"
          }
        </DialogDescription>
      </DialogHeader>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-blue-600' : 'text-green-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 1 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
            }`}>
            1
          </div>
          <span className="text-sm font-medium">Restaurant</span>
        </div>
        <div className="w-8 h-px bg-gray-300"></div>
        <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}>
            2
          </div>
          <span className="text-sm font-medium">Owner</span>
        </div>
      </div>

      {/* Render Current Step */}
      {currentStep === 1 ? (
        <RestaurantStep
          onNext={handleRestaurantNext}
          onCancel={handleCancel}
          initialData={restaurantData || undefined}
        />
      ) : (
        <OwnerStep
          onSubmit={handleOwnerSubmit}
          onBack={handleBackToStep1}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default CreateRestaurantDialog;
