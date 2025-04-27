import { z } from 'zod';

export const inquirySchema = z.object({
  restaurantName: z.string().min(1, 'Restaurant name is required'),
  numberOfOutlets: z.number().min(1, 'Number of outlets must be at least 1'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  contactName: z.string().min(1, 'Contact name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
}); 