import { Model, Types } from "mongoose"
import { IUser } from "../user/user.interface"

export type INote={
    note:string,
    userId:Types.ObjectId | IUser
}

export type noteModel = Model<INote, Record<string, unknown>>