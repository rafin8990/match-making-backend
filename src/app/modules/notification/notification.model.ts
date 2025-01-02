import { Schema, model } from 'mongoose'
import { INotification, notificationModel } from './notification.interface'

const notificationSchema = new Schema<INotification, Record<string, never>, INotification>(
  {
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
    },
    relatedEntityId: {
      type: String,
    },
    status: {
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

export const Notification = model<INotification, notificationModel>('notification', notificationSchema)
