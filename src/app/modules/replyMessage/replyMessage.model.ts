import { model, Schema } from 'mongoose'
import { IReplyMessage, replyMessageModel } from './replyMessage.interface'

// Define the Mongoose schema for the Question model
const replyMessageSchema = new Schema<IReplyMessage>(
  {
    content: { type: String },
    email: { type: String },
    messageId: { type: String },
    subject: { type: String },
    userId: { type: String },
  },
  {
    timestamps: true,
  }
)

// Create and export the model
export const ReplyMessage = model<IReplyMessage, replyMessageModel>(
  'ReplyMessage',
  replyMessageSchema
)
