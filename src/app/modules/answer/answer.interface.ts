import { Model, Types } from "mongoose"
import { IUser } from "../user/user.interface"

export type IAnswer={
    answer:string
    question:string
    userId:Types.ObjectId | IUser
}

export type answerModel = Model<IAnswer, Record<string, unknown>>