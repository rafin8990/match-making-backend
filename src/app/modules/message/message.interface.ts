export type IMessage={
title:string
content:string;
isRead:true | false
files?:string
name?:string
email?:string
}


export type ComposeFormData= {
    selectedImage?: string;
    email?: string;
    title?: string;
    content?: string;
}

export type IQuestion={
    question: string;
    type: string
    options: string[];
}
