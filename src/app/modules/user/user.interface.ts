import { Model } from 'mongoose'
import {
  USER_RELIGION
} from '../../enums/users'

export type IUser = {
  email: string
  role: string
  password: string
  passwordChangedAt?: Date
  needsPasswordChange: true | false
  isVerified: true | false
  name?: string
  address?: {
    city?: string
    state?: string
    country?: string
  }
  phoneNumber?: string
  age?: number
  sex?: 'male'|'female'|'other'
  height?: {
    fit: string
    inch: string
  }
  dateOfBirth?: string
  birthPlace?: string
  education?: 'college'|'high school'|'other'
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
  investLongTermRelationship: 'yes' | 'no'
  countriesVisited?: number
  immigratedYear?: string
  looks?: string
  religion?: USER_RELIGION
  joinFamilyLiving: 'yes' | 'no'
  ageRange?: string
  wantChildren?: 'yes' | 'no'
  image?: string
}

export type IUserMethod = {
  isUserExist(email: string): Promise<Partial<IUser | null>>
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
}

export type userModel = Model<IUser, Record<string, unknown>, IUserMethod>
