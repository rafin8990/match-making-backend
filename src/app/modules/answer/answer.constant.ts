export type IAnswerFilter = {
    searchTerm: string
    answer?: string,
    question?:string
  }
  

export const AnswerSearchableFields = ['answer','question','userId']
export const AnswerFilterableFields = ['answer','question','userId']