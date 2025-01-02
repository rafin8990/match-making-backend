import { Schema, model } from 'mongoose'
import { INote, noteModel } from './note.interface'



const noteSchema = new Schema<INote>({
    note: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})

export const Note = model<INote, noteModel>('Note', noteSchema)