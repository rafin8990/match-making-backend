export type IMessageFilter = {
    searchTerm: string
    email?: string
  }

  export const MessageSearchableFields = [
    'email',
    'content',
  ]
  export const MessageFilterableFields = [
    'email',
    'content',
  ]