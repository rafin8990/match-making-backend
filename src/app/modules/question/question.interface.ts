import { Model } from 'mongoose'

// Define the enum for Question types
export enum QuestionType {
  MCQ = 'MCQ',
  INPUT = 'Input',
}

// Define the interface for Question
export type IQuestion = {
  _id?: string
  question: string
  type: QuestionType
  options?: string[]
  answer?: string
  userId?: string
}

// Define the model type for Mongoose
export type questionModel = Model<IQuestion, Record<string, unknown>>
