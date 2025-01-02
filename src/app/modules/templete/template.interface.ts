import { Model } from 'mongoose'

export type ITemplate = {
  name: string
  status: string
  htmlContent: string
  userId: string
}

export type templateModel = Model<ITemplate, Record<string, unknown>>
