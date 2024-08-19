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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)



export const Message = model<IMessage, messageModel>('Message', messageSchema)
