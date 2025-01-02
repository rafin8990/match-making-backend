/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from 'mongoose'
export type QuestionType={
  question:string
  answer: string
  type:string
}
export type IUser = {
  _id: any
  email: string
  role: 'user' | 'admin'
  password: string
  passwordChangedAt?: Date
  needsPasswordChange: true | false
  isVerified: true | false
  isUpdated?: true | false
  isApproved?: true | false
  is2Authenticate?: true | false
  isFirstTime?: true | false
  isDisabled?: true | false
  firstName:string,
  lastName:string,
  address?: {
    city?: string
    state?: string
    zip:number
    country?: string
  }
  phoneNumber?: string
  age?: number
  sex?: string
  height: {
    heightfeet: number,
    heightinch: number,
  },
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
  countriesVisited?: string
  immigratedYear?: string
  selectedImage?: string
  images?:string[]
  pendingImages?:string[]
  verificationCode?: number | null
  pendingUpdates?: Partial<IUser>
  preferences?: {
    looks?: number
    religion?: number
    joinFamilyLiving?: number
    education?: number
    ageRange?: [number, number];
    wantChildren?: number
  },
  matches?:string[];
  otpCode ?:number;
  otpExpiration?:Date;
  questions?:QuestionType[];
  referredBy?:string
  maritual_status?:string

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
