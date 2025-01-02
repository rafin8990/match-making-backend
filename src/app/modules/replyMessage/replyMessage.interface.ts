import { Model } from 'mongoose'

export type IReplyMessage = {
  content: string
  email: string
  messageId: string
  subject: string
  userId: string
}

export type replyMessageModel = Model<IReplyMessage, Record<string, unknown>>
