import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import config from '../../../config'

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

export const sendEmail = async (to: string, subject: string, text: string) => {
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
