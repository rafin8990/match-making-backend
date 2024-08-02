import { Model } from 'mongoose'
export type IUser = {
  email: string
  role: 'user' | 'admin'
  password: string
  passwordChangedAt?: Date
  needsPasswordChange: true | false
  isVerified: true | false
  isUpdated: true | false
  isApproved: true | false
  is2Authenticate: true | false
  name?: string
  address?: {
    city?: string
    state?: string
    country?: string
  }
  phoneNumber?: string
  age?: number
  sex?: 'male' | 'female' | 'other'
  height?: string
  dateOfBirth?: string
  birthPlace?: string
  education?: 'college' | 'high school' | 'other'
  educationDetails?: string
  profession?: string
  currentJob?: string
  language?: string
  jamatkhanaAttendence?: string
  haveChildren?: true | false
  personality?: string
  sports?: string
  hobbies?: string
  comfortableLongDistance?: 'yes' | 'no'
  partnerGeneratingIncom?: string
  socialHabits?: string
  partnersFamilyBackground?: string
  partnerAgeCompare?: string
  reloacte?: 'yes' | 'no'
  supportPartnerWithElderlyParents?: 'yes' | 'no'
  investLongTermRelationship?: 'yes' | 'no'
  countriesVisited?: number
  immigratedYear?: string
  image?: string
  verificationCode?: number | null
  pendingUpdates?: Partial<IUser>
  updateStatusMessage?: string
  preferences: {
    looks?: number
    religion?: number
    joinFamilyLiving?: number
    education?: number
    ageRange?: number
    wantChildren?: number
  }
}

export type IUserMethod = {
  isUserExist(email: string): Promise<Partial<IUser | null>>
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
}

export type userModel = Model<IUser, Record<string, unknown>, IUserMethod>
