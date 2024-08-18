import { model, Schema } from 'mongoose'
import { IQuestion, questionModel, QuestionType } from './question.interface'

const questionSchema = new Schema<IQuestion>(
  {
    question: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(QuestionType),
      required: true,
    },
    options: [{ type: String }],
    answer: { type: String },
  },
  {
    timestamps: true,
  }
)

export const Question = model<IQuestion,questionModel>('Question', questionSchema)

