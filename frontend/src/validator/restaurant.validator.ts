import { z } from 'zod';

export const createRestaurantSchema = z.object({
  restaurant: z.object({
    name: z.string()
      .min(1, 'Restaurant name is required')
      .min(2, 'Restaurant name must be at least 2 characters')
      .max(100, 'Restaurant name must not exceed 100 characters')
      .trim(),
    logo: z.string()
      .url('Please enter a valid logo URL')
      .optional()
      .or(z.literal('')),
  }),
  user: z.object({
    name: z.string()
      .min(1, 'Owner name is required')
      .min(2, 'Owner name must be at least 2 characters')
      .max(50, 'Owner name must not exceed 50 characters')
      .trim(),
    email: z.string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .trim()
      .toLowerCase(),
    phone: z.string()
      .min(1, 'Phone number is required')
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits')
      .regex(/^[+]?[\d\s\-()]+$/, 'Please enter a valid phone number')
      .trim(),
  }),
});

export type CreateRestaurantFormData = z.infer<typeof createRestaurantSchema>;