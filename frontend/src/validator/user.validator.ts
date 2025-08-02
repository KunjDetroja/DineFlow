import { z } from "zod";
import { ROLES } from "@/utils/constant";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email address").trim(),
  phone: z.string().min(1, "Phone number is required").trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
  role: z.enum(ROLES as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
  restaurantId: z.string().optional(),
  outletId: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").trim().optional(),
  email: z.string().email("Invalid email address").trim().optional(),
  phone: z.string().min(1, "Phone number is required").trim().optional(),
  role: z.enum(ROLES as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }).optional(),
  restaurantId: z.string().optional(),
  outletId: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;