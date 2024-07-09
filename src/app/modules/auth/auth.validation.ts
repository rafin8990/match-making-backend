import { z } from 'zod';

const LoginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
    }),
  }),
});

const changePasswordZodSchema = z.object({
  body: z.object({
    newPassword: z.string({
      required_error: 'New Password is required',
    }),
  }),
});

export const AuthValidation = {
  LoginZodSchema,
  refreshTokenZodSchema,
  changePasswordZodSchema,
};
