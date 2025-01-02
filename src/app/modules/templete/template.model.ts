import { model, Schema } from 'mongoose'
import { ITemplate, templateModel } from './template.interface'

const templateSchema = new Schema<ITemplate>({
  name: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  htmlContent: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },

},
  {
    timestamps: true,
  }
)

export const Template = model<ITemplate, templateModel>(
  'Template',
  templateSchema
)
