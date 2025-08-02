import { z } from 'zod';

// Base outlet schema with common fields
const baseOutletSchema = z.object({
  name: z.string()
    .min(1, 'Outlet name is required')
    .min(2, 'Outlet name must be at least 2 characters')
    .max(100, 'Outlet name must not exceed 100 characters')
    .trim(),
  address: z.string()
    .min(1, 'Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters')
    .trim(),
  city: z.string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must not exceed 50 characters')
    .trim(),
  state: z.string()
    .min(1, 'State is required')
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must not exceed 50 characters')
    .trim(),
  country: z.string()
    .min(1, 'Country is required')
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country must not exceed 50 characters')
    .trim(),
  pincode: z.string()
    .min(1, 'Pincode is required')
    .min(4, 'Pincode must be at least 4 characters')
    .max(10, 'Pincode must not exceed 10 characters')
    .trim(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^[+]?[\d\s\-()]+$/, 'Please enter a valid phone number')
    .trim()
    .optional()
    .or(z.literal('')),
});

// Admin create outlet schema (requires restaurantId)
export const createOutletSchemaAdmin = baseOutletSchema.extend({
  restaurantId: z.string()
    .min(1, 'Restaurant selection is required')
    .trim(),
});

// Owner create outlet schema (restaurantId not needed)
export const createOutletSchemaOwner = baseOutletSchema.extend({
  restaurantId: z.string().optional(),
});

// Generic create outlet schema (for backward compatibility)
export const createOutletSchema = baseOutletSchema.extend({
  restaurantId: z.string().optional(),
});

// Update outlet schema
export const updateOutletSchema = z.object({
  name: z.string()
    .min(2, 'Outlet name must be at least 2 characters')
    .max(100, 'Outlet name must not exceed 100 characters')
    .trim()
    .optional(),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters')
    .trim()
    .optional(),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must not exceed 50 characters')
    .trim()
    .optional(),
  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must not exceed 50 characters')
    .trim()
    .optional(),
  country: z.string()
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country must not exceed 50 characters')
    .trim()
    .optional(),
  pincode: z.string()
    .min(4, 'Pincode must be at least 4 characters')
    .max(10, 'Pincode must not exceed 10 characters')
    .trim()
    .optional(),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^[+]?[\d\s\-()]+$/, 'Please enter a valid phone number')
    .trim()
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().optional(),
});

export type CreateOutletFormData = z.infer<typeof createOutletSchema>;
export type CreateOutletFormDataAdmin = z.infer<typeof createOutletSchemaAdmin>;
export type CreateOutletFormDataOwner = z.infer<typeof createOutletSchemaOwner>;
export type UpdateOutletFormData = z.infer<typeof updateOutletSchema>;