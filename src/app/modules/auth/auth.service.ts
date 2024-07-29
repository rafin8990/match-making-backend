import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { JwtPayload, Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { jwtHelpers } from '../../../helper/jwtHelper'
import { IUser } from '../user/user.interface'
import { User } from '../user/user.model'
import { sendVerificationCode } from './auth.constant'
import {
  IChangePassword,
  IForgetPassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface'

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload
  const user = await User.findOne(
    { email: email },
    { password: 1, email: 1, role: 1, needsPasswordChange: 1 }
  )

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  const givenPassword = await bcrypt.compare(password, user?.password as string)

  console.log(givenPassword)

  if (!givenPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password did not match')
  }

  if (user.isAuthenticate) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000)
    const subject = 'Your Verification Code'
    const text = `<p>Your verification code is <b>${verificationCode}</b>. Please enter this code to complete your login.</p>`
    user.verificationCode = verificationCode
    await user.save()
    await sendVerificationCode(user.email , subject, text)
  }

  // Create access and refresh tokens
  const accessToken = jwtHelpers.createToken(
    { email: user.email, role: user.role },
    config.jwt_secret as string,
    config.jwt_expires_in as string
  )

  const refreshToken = jwtHelpers.createToken(
    { email: user.email, role: user.role },
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  )

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
  }
}

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  const user = new User()
  let verifiedToken = null
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt_refresh_secret as Secret
    )
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'invalid refresh token')
  }

  // checking deleted users refresh token
  const { email } = verifiedToken
  const isUserExist = await user.isUserExist(email)
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    { id: isUserExist?.email, role: isUserExist?.role },
    config.jwt_secret as Secret,
    config.jwt_expires_in as string
  )

  return {
    accessToken: newAccessToken,
  }
}

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<IUser | null> => {
  const { oldPassword, newPassword } = payload
  const users = new User()
  const isUserExist = await users.isUserExist(user?.email)
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  // checking old pass
  const passwordMatched = users.isPasswordMatched(
    oldPassword,
    isUserExist.password as string
  )
  if (isUserExist?.password && !passwordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password did not matched')
  }

  // hash pass
  const newHashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_sault_round)
  )

  const email = user?.email

  const updatedData = {
    password: newHashPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
  }
  // update password
  const updatedUser = await User.findOneAndUpdate(
    { email: email },
    {
      $set: updatedData,
    }
  )

  if (!updatedUser) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update password'
    )
  }

  return updatedUser
}

const forgetPassword = async (
  user: JwtPayload | null,
  payload: IForgetPassword
): Promise<IUser | null> => {
  const { newPassword } = payload
  const users = new User()
  const isUserExist = await users.isUserExist(user?.email)
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  // hash pass
  const newHashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_sault_round)
  )
  const email = user?.email

  const updatedData = {
    password: newHashPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
  }
  // update password
  const updatedUser = await User.findOneAndUpdate(
    { email: email },
    {
      $set: updatedData,
    }
  )

  if (!updatedUser) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update password'
    )
  }

  return updatedUser
}

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
}
