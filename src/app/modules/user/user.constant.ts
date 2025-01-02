/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer'
// import smtpTransport from 'nodemailer-smtp-transport'
// import config from '../../../config'



export type IUserFilter = {
  searchTerm: string
  email?: string
}

export const UserSearchableFields = [
  '_id',
  'email',
  'name',
  'email',
  'address.country',
  'address.city',
  'address.state',
  'phoneNumber',
  'birthPlace',
  'language',
  'education',
]

export const UserFilterableFields = [
  'searchTerm',
  '_id',
  'email',
  'name',
  'email',
  'address.country',
  'address.city',
  'address.state',
  'phoneNumber',
  'birthPlace',
  'language',
  'education',
]

export const generateRandomPassword = (): string => {
  const length = 8
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let password = ''
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n))
  }
  return password
}

// export const sendEmail = async (to: string, subject: string, html: any) => {
//   const transporter = nodemailer.createTransport(
//     smtpTransport({
//       service: 'Gmail',
//       auth: {
//         user: config.emailUser,
//         pass: config.emailPassword,
//       },
//     })
//   )
//   const mailOptions = {
//     from: config.emailFrom,
//     to,
//     subject,
//     html,
//   }

//   await transporter.sendMail(mailOptions)
// }

export const sendEmail = async (to: string, subject: string, html: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587, 
      secure: false, 
      auth: {
        user: 'fmawji@pamojafm.world',
        pass: 'HnUda8AG$K',
      }
    });

    const mailOptions = {
      from: 'fmawji@pamojafm.world',
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
   
      console.error('Error occurred after headers were sent:', error);
  }
};
export const sendOTPEmail = async (to: string, subject: string, otpCode: number) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587, 
      secure: false, 
      auth: {
        user: 'fmawji@pamojafm.world',
        pass: 'HnUda8AG$K',
      }
    });

    const mailOptions = {
      from: 'fmawji@pamojafm.world',
      to,
      subject,
      html:`
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <img src="cid:logo" style="width: 150px;" alt="Logo" />
          <p>Your authentication code is:</p>
          <h2>${otpCode}</h2>
          <p>This code will expire in 2 minutes.</p>
        </div>
      `,
      attachments: [
        {
          filename: "logo.png",
          path: "./images/logo.png",
          cid: "logo", 
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
   
      console.error('Error occurred after headers were sent:', error);
  }
};


// export const sendEmail = async (to: string, subject: string, html: any) => {
//   let retries = 3; 
//   const mailOptions = {
//     from: 'fmawji@pamojafm.world', 
//     to, 
//     subject, 
//     html, 
//   };


//   while (retries > 0) {
//     try {
    
//       const transporter = nodemailer.createTransport({
//         host: 'smtp.secureserver.net', 
//         port: 587,
//         secure: false,
//         auth: {
//           user: 'fmawji@pamojafm.world', 
//           pass: 'HnUda8AG$K', 
//         },
//         connectionTimeout: 10000,
//       });


//       await transporter.sendMail(mailOptions);


      


//       break;
//     } catch (error) {

//       retries--;
//       console.error('Retrying email send...', retries, error);

     
//     }
//   }
// };
