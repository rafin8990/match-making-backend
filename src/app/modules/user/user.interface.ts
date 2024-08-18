import { Model } from 'mongoose'
export type IUser = {
  email: string
  role: 'user' | 'admin'
  password: string
  passwordChangedAt?: Date
  needsPasswordChange: true | false
  isVerified: true | false
  isUpdated?: true | false
  isApproved?: true | false
  is2Authenticate?: true | false
  firstName:string,
  lastName:string,
  address?: {
    city?: string
    state?: string
    country?: string
  }
  phoneNumber?: string
  age?: number
  sex?: string
  height?: string
  dateOfBirth?: string
  birth_country?:string
  birthPlace?: string
  education?: string
  educationDetails?: string
  profession?: string
  currentJob?: string
  language?: string
  jamatkhanaAttendence?: string
  haveChildren?: string
  personality?: string
  sports?: string
  hobbies?: string
  comfortableLongDistance?: string
  partnerGeneratingIncom?: string
  socialHabits?: string
  partnersFamilyBackground?: string
  partnerAgeCompare?: {
    minAge:number
    maxAge:number
  }
  relocate?: string
  supportPartnerWithElderlyParents?: string
  investLongTermRelationship?: string
  countriesVisited?: number
  immigratedYear?: string
  selectedImage?: string
  images?:string[]
  verificationCode?: number | null
  pendingUpdates?: Partial<IUser>
  updateStatusMessage?: string
  preferences?: {
    looks?: number
    religion?: number
    joinFamilyLiving?: number
    education?: number
    ageRange?: [number, number];
    wantChildren?: number
  },
  matches?:string[]
}

export type IUserMethod = {
  isUserExist(email: string): Promise<Partial<IUser | null>>
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
  addImage(imageUrl: string): Promise<void>;
}

export type userModel = Model<IUser, Record<string, unknown>, IUserMethod>
