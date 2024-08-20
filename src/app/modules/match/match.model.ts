
import { Schema, model } from 'mongoose'
import { IUserMatch, matchModel } from './match.interface'


const matchSchema = new Schema<IUserMatch, Record<string, never>>(
  {
    userId: {
        type: String,
        ref: 'User',
        required: true,
      },
      userAction: {
        type: String,
        enum: ['no', 'yes'],
        required: true,
      },
      matchesUserId: {
        type: String,
        ref: 'User',
        required: true,
      },
      matchesAction: {
        type: String,
        enum: ['no', 'yes'],
        required: true,
      },
      action: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        required: true,
      },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)





export const Match = model<IUserMatch, matchModel>('Match', matchSchema)
