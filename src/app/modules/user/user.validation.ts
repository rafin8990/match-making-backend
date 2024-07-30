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
    email: z.string().email().optional(),
    role: z.enum(['user', 'admin']).optional(),
    password: z.string().optional(),
    passwordChangedAt: z.date().optional(),
    needsPasswordChange: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    isUpdated: z.boolean().optional(),
    isApproved: z.boolean().optional(),
    isAuthenticate: z.boolean().optional(),
    name: z.string().optional(),
    address: z.object({
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
    phoneNumber: z.string().optional(),
    age: z.number().optional(),
    sex: z.enum(['male', 'female', 'other']).optional(),
    height: z.object({
      fit: z.string(),
      inch: z.string(),
    }).optional(),
    dateOfBirth: z.string().optional(),
    birthPlace: z.string().optional(),
    education: z.enum(['college', 'high school', 'other']).optional(),
    educationDetails: z.string().optional(),
    profession: z.string().optional(),
    currentJob: z.string().optional(),
    language: z.string().optional(),
    jamatkhanaAttendence: z.string().optional(),
    haveChildren: z.boolean().optional(),
    personality: z.string().optional(),
    sports: z.string().optional(),
    hobbies: z.string().optional(),
    comfortableLongDistance: z.enum(['yes', 'no']).optional(),
    partnerGeneratingIncome: z.string().optional(),
    socialHabits: z.string().optional(),
    partnersFamilyBackground: z.string().optional(),
    partnerAgeCompare: z.string().optional(),
    relocate: z.enum(['yes', 'no']).optional(),
    supportPartnerWithElderlyParents: z.enum(['yes', 'no']).optional(),
    investLongTermRelationship: z.enum(['yes', 'no']).optional(),
    countriesVisited: z.number().optional(),
    immigratedYear: z.string().optional(),
    image: z.string().optional(),
    verificationCode: z.number().optional(),
  }),
});
export const UserValidation = {
  createUserZodSchema,
  UpdateUserZodSchema
};


