import { Model } from 'mongoose';

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
  
  


};

export type IUserMethod = {
  isUserExist(email: string): Promise<Partial<IUser | null>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
};

export type userModel = Model<IUser, Record<string, unknown>, IUserMethod>;
