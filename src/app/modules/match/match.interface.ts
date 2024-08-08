import { Model } from 'mongoose'
export type IUserMatch = {
  userId: string
  suggestedUserId: string
  action: 'pending' | 'accepted' | 'declined'
}

export type userModel = Model<IUserMatch, Record<string, unknown>>
