import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import config from '../../../config'


export const sendVerificationCode = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'Gmail',
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    })
  )

  const mailOptions = {
    from: config.emailFrom,
    to,
    subject,
    text,
  }

  await transporter.sendMail(mailOptions)
}