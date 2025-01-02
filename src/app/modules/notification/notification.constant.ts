export type INotificationFilter = {
    searchTerm: string
    email?: string
  }

  export const notificationSearchableFields = [
    'email',
    'content',
  ]
  export const notificationFilterableFields = [
    'email',
    'content',
  ]