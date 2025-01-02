import { model, Schema } from 'mongoose'
import { IQuestion, questionModel, QuestionType } from './question.interface'

// Define the Mongoose schema for the Question model
const questionSchema = new Schema<IQuestion>(
  {
    question: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(QuestionType), // Ensure enum values are correctly used
      required: true,
    },
    options: [{ type: String }],
    answer: { type: String },
    userId: { type: String },
  },
  {
    timestamps: true,
  }
)

// Create and export the model
export const Question = model<IQuestion, questionModel>('Question', questionSchema)
