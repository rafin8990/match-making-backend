import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    needsPasswordChange:z.boolean().optional(),
    passwordChangedAt: z.date().optional(),
    isVerified: z.boolean().optional(),
  }),
})
const UpdateUserZodSchema = z.object({
  body: z.object({
    email: z.string().optional(),
    needsPasswordChange:z.boolean().optional(),
    passwordChangedAt: z.date().optional(),
    isVerified: z.boolean().optional(),
  }),
})
export const UserValidation = {
  createUserZodSchema,
  UpdateUserZodSchema
};


