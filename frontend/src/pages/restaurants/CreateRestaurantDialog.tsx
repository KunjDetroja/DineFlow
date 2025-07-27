import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Loader2, Building2, User, Mail, Phone, Image } from 'lucide-react';
import { useCreateRestaurantMutation } from '@/store/services/restaurant.service';
import {
  createRestaurantSchema,
  CreateRestaurantFormData,
} from '@/validator/restaurant.validator';

interface CreateRestaurantDialogProps {
  onClose: () => void;
}

const CreateRestaurantDialog: React.FC<CreateRestaurantDialogProps> = ({
  onClose,
}) => {
  const [createRestaurant, { isLoading }] = useCreateRestaurantMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRestaurantFormData>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: {
      restaurant: {
        name: '',
        logo: '',
      },
      user: {
        name: '',
        email: '',
        phone: '',
      },
    },
  });

  const onSubmit = async (data: CreateRestaurantFormData) => {
    try {
      // Clean up logo field if empty
      const cleanedData = {
        ...data,
        restaurant: {
          ...data.restaurant,
          logo: data.restaurant.logo?.trim() || undefined,
        },
      };

      const response = await createRestaurant(cleanedData).unwrap();
      
      if (response.success) {
        toast.success(response.message || 'Restaurant created successfully');
        reset();
        onClose();
      } else {
        toast.error(response.message || 'Failed to create restaurant');
      }
    } catch (error: any) {
      console.error('Error creating restaurant:', error);
      const errorMessage = error?.data?.message || 'Failed to create restaurant';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Create New Restaurant
        </DialogTitle>
        <DialogDescription>
          Add a new restaurant and create an owner account. The owner will receive login credentials via email.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Restaurant Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Building2 className="h-4 w-4" />
            Restaurant Information
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="restaurant.name">Restaurant Name *</Label>
            <Input
              id="restaurant.name"
              placeholder="Enter restaurant name"
              {...register('restaurant.name')}
              className={errors.restaurant?.name ? 'border-red-500' : ''}
            />
            {errors.restaurant?.name && (
              <p className="text-sm text-red-500">{errors.restaurant.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurant.logo" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Logo URL (Optional)
            </Label>
            <Input
              id="restaurant.logo"
              placeholder="https://example.com/logo.png"
              {...register('restaurant.logo')}
              className={errors.restaurant?.logo ? 'border-red-500' : ''}
            />
            {errors.restaurant?.logo && (
              <p className="text-sm text-red-500">{errors.restaurant.logo.message}</p>
            )}
          </div>
        </div>

        {/* Owner Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <User className="h-4 w-4" />
            Owner Information
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user.name">Owner Name *</Label>
            <Input
              id="user.name"
              placeholder="Enter owner's full name"
              {...register('user.name')}
              className={errors.user?.name ? 'border-red-500' : ''}
            />
            {errors.user?.name && (
              <p className="text-sm text-red-500">{errors.user.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user.email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="user.email"
              type="email"
              placeholder="owner@restaurant.com"
              {...register('user.email')}
              className={errors.user?.email ? 'border-red-500' : ''}
            />
            {errors.user?.email && (
              <p className="text-sm text-red-500">{errors.user.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="user.phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="user.phone"
              placeholder="+1 (555) 123-4567"
              {...register('user.phone')}
              className={errors.user?.phone ? 'border-red-500' : ''}
            />
            {errors.user?.phone && (
              <p className="text-sm text-red-500">{errors.user.phone.message}</p>
            )}
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Restaurant'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRestaurantDialog;