"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const LoginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is required',
        }),
    }),
});
const changePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: 'old Password is required',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New Password is required',
        }),
    }),
});
const forgetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        newPassword: zod_1.z.string({
            required_error: 'New Password is required',
        }),
    }),
});
const verify2FAZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        verificationCode: zod_1.z.number({
            required_error: 'Verification code is required',
        }),
    }),
});
exports.AuthValidation = {
    LoginZodSchema,
    refreshTokenZodSchema,
    changePasswordZodSchema,
    forgetPasswordZodSchema,
    verify2FAZodSchema,
};
