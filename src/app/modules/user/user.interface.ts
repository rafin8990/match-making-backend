import { Model } from 'mongoose';
import { ENUM_COMFORTABLE_RELATIONSHIP, ENUM_USER_EDUCATION, ENUM_USER_SEX } from '../../enums/users';

export type IUser = {
  email: string;
  role: string;
  password: string;
  passwordChangedAt?: Date;
  needsPasswordChange: true | false;
  isVerified: true | false;
  name?:string;
  address?:{
    city?:string;
    state?:string;
    country?:string;

  };
  phoneNumber?:string;
  age?:number;
  sex?:ENUM_USER_SEX ,
  height?:{
    fit:string,
    inch:string
  },
  dateOfBirth?:string,
  birthPlace?:string,
  education?:ENUM_USER_EDUCATION,
  educationDetails?:string,
  profession?:string,
  currentJob?:string,
  language?:string,
  jamatkhanaAttendence?:string,
  haveChildren?:true | false,
  personality?:string,
  sports?:string,
  hobbies?:string,
  comfortableLongDistance?:ENUM_COMFORTABLE_RELATIONSHIP,




};

export type IUserMethod = {
  isUserExist(email: string): Promise<Partial<IUser | null>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
};

export type userModel = Model<IUser, Record<string, unknown>, IUserMethod>;
