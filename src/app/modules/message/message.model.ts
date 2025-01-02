import { Schema, model } from 'mongoose'
import { IMessage, messageModel } from './message.interface'

const messageSchema = new Schema<IMessage, Record<string, never>, IMessage>(
  {
    email: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    seen: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

export const Message = model<IMessage, messageModel>('Message', messageSchema)
