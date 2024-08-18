import { Model } from "mongoose";

export type IMessage={
title:string
content:string;
isRead:true | false
files?:string
name?:string
email:string
}

export type messageModel = Model<IMessage, Record<string, unknown>>

// export type ComposeFormData= {
//     selectedImage?: string;
//     email?: string;
//     title?: string;
//     content?: string;
// }

// export type IQuestion={
//     question: string;
//     type: string
//     options: string[];
// }
