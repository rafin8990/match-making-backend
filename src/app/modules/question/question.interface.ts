import { Model } from "mongoose";

export enum QuestionType {
    MCQ = 'MCQ',
    INPUT = 'INPUT',
}

export type IQuestion ={
    _id?: string;
    question: string;
    type: QuestionType;
    options?: string[]; 
    answer?: string;    
}

export type questionModel = Model<IQuestion, Record<string, unknown>>