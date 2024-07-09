import nodemailer from 'nodemailer';
import smtpTransport from "nodemailer-smtp-transport";
import config from '../../../config';

export type IUserFilter = {
    searchTerm: string;
    email?: string;
  };

  export const UserSearchableFields = [
    '_id',
    'email',
  ];
  
  export const UserFilterableFields = [
    'searchTerm',
    'email',
    '_id',
  ];

  export const generateRandomPassword = (): string => {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };

  export const sendEmail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport(
        smtpTransport({
          service: "Gmail", // or your preferred service
          auth: {
            user: config.emailUser,
            pass: config.emailPassword,
          },
        })
      );
    
  
    const mailOptions = {
      from: config.emailFrom,
      to,
      subject,
      text,
    };
  
    await transporter.sendMail(mailOptions);
  };