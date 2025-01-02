export type IReplyMessageFilter = {
    searchTerm: string
    email?: string
  }

  export const ReplyMessageSearchableFields = [
    'email',
    'content',
  ]
  export const ReplyMessageFilterableFields = [
    'email',
    'content',
  ]