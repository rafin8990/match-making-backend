import { model, Schema } from 'mongoose'
import { answerModel, IAnswer } from './answer.interface'

const answerSchema = new Schema<IAnswer>({
    answer: {
    type: String,
    required: true,
  },
  question:{
    type:String,
    required:true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

export const Answer = model<IAnswer, answerModel>('Answer', answerSchema)