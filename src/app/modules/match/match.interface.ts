import { Model } from 'mongoose'
export type IUserMatch = {
  userId: string
  userAction: 'no' | 'yes'
  matchesUserId: string
  matchesAction: 'no' | 'yes'
  action: 'pending' | 'accepted' | 'declined'
}

export type matchModel = Model<IUserMatch, Record<string, unknown>>
