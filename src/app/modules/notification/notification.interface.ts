import { Model } from 'mongoose'

export type INotification = {
  userId: string
  type: string //request, accept, message
  message: string
  priority: string // low, meedium, high
  section: string // match, message, question
  relatedEntityId: string // link to specific entities
  status: string //read/unread
}

export type notificationModel = Model<INotification, Record<string, unknown>>
