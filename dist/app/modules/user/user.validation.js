"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        needsPasswordChange: zod_1.z.boolean().optional(),
        passwordChangedAt: zod_1.z.date().optional(),
        isVerified: zod_1.z.boolean().optional(),
        phoneNumber: zod_1.z.string().nullable().optional(),
    }),
});
const UpdateUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email().optional(),
        role: zod_1.z.enum(['user', 'admin']).optional(),
        password: zod_1.z.string().optional(),
        passwordChangedAt: zod_1.z.date().optional(),
        needsPasswordChange: zod_1.z.boolean().optional(),
        isVerified: zod_1.z.boolean().optional(),
        isUpdated: zod_1.z.boolean().optional(),
        is2Authenticate: zod_1.z.boolean().optional(),
        isApproved: zod_1.z.boolean().optional(),
        name: zod_1.z.string().optional(),
        address: zod_1.z
            .object({
            city: zod_1.z.string().optional(),
            state: zod_1.z.string().optional(),
            country: zod_1.z.string().optional(),
        })
            .optional(),
        phoneNumber: zod_1.z.string().optional(),
        age: zod_1.z.number().optional(),
        sex: zod_1.z.enum(['male', 'female', 'other']).optional(),
        height: zod_1.z.string().optional(),
        dateOfBirth: zod_1.z.string().optional(),
        birth_country: zod_1.z.string().optional(),
        birthPlace: zod_1.z.string().optional(),
        education: zod_1.z.enum(['college', 'high school', 'other']).optional(),
        educationDetails: zod_1.z.string().optional(),
        profession: zod_1.z.string().optional(),
        currentJob: zod_1.z.string().optional(),
        language: zod_1.z.string().optional(),
        jamatkhanaAttendence: zod_1.z.string().optional(),
        haveChildren: zod_1.z.boolean().optional(),
        personality: zod_1.z.string().optional(),
        sports: zod_1.z.string().optional(),
        hobbies: zod_1.z.string().optional(),
        comfortableLongDistance: zod_1.z.enum(['yes', 'no']).optional(),
        partnerGeneratingIncom: zod_1.z.string().optional(),
        socialHabits: zod_1.z.string().optional(),
        partnersFamilyBackground: zod_1.z.string().optional(),
        partnerAgeCompare: zod_1.z
            .object({
            minAge: zod_1.z.number().optional(),
            maxAge: zod_1.z.number().optional(),
        })
            .optional(),
        relocate: zod_1.z.enum(['yes', 'no']).optional(),
        supportPartnerWithElderlyParents: zod_1.z.enum(['yes', 'no']).optional(),
        investLongTermRelationship: zod_1.z.enum(['yes', 'no']).optional(),
        countriesVisited: zod_1.z.number().optional(),
        immigratedYear: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        verificationCode: zod_1.z.number().optional(),
        pendingUpdates: zod_1.z.any().optional(),
        updateStatusMessage: zod_1.z.string().optional(),
        preferences: zod_1.z
            .object({
            looks: zod_1.z.number().optional(),
            religion: zod_1.z.number().optional(),
            joinFamilyLiving: zod_1.z.number().optional(),
            education: zod_1.z.number().optional(),
            ageRange: zod_1.z.array(zod_1.z.number()).optional(),
            wantChildren: zod_1.z.number().optional(),
        })
            .optional(),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
    UpdateUserZodSchema,
};
