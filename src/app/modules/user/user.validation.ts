import { z } from 'zod'

const createUserZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    needsPasswordChange: z.boolean().optional(),
    passwordChangedAt: z.date().optional(),
    isVerified: z.boolean().optional(),
    phoneNumber: z.string().nullable().optional(),
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
    is2Authenticate: z.boolean().optional(),
    isApproved: z.boolean().optional(),
    name: z.string().optional(),
    address: z
      .object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    phoneNumber: z.string().optional(),
    age: z.number().optional(),
    sex: z.string().optional(),
    height: z.string().optional(),
    dateOfBirth: z.string().optional(),
    birth_country: z.string().optional(),
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
    partnerGeneratingIncom: z.string().optional(),
    socialHabits: z.string().optional(),
    partnersFamilyBackground: z.string().optional(),
    partnerAgeCompare: z
      .object({
        minAge: z.number().optional(),
        maxAge: z.number().optional(),
      })
      .optional(),
    relocate: z.enum(['yes', 'no']).optional(),
    supportPartnerWithElderlyParents: z.enum(['yes', 'no']).optional(),
    investLongTermRelationship: z.enum(['yes', 'no']).optional(),
    countriesVisited: z.number().optional(),
    immigratedYear: z.string().optional(),
    image: z.string().optional(),
    verificationCode: z.number().optional(),
    pendingUpdates: z.any().optional(),
    updateStatusMessage: z.string().optional(),
    preferences: z
      .object({
        looks: z.number().optional(),
        religion: z.number().optional(),
        joinFamilyLiving: z.number().optional(),
        education: z.number().optional(),
        ageRange: z.array(z.number()).optional(),
        wantChildren: z.number().optional(),
      })
      .optional(),
  }),
})

export const UserValidation = {
  createUserZodSchema,
  UpdateUserZodSchema,
}
