
import { Schema, Types, model } from 'mongoose'
import { IUserMatch, matchModel } from './match.interface'


const matchSchema = new Schema<IUserMatch, Record<string, never>>(
  {
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
      },
      matchesUserId: {
        type: Types.ObjectId,
        ref: 'User',
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
