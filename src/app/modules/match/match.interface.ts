import { Model, Types } from 'mongoose'
import { IUser } from '../user/user.interface'
export type IUserMatch = {
  userId: Types.ObjectId | IUser
  matchesUserId: Types.ObjectId | IUser
  action: 'pending' | 'accepted' | 'declined'
}

export type matchModel = Model<IUserMatch, Record<string, unknown>>
