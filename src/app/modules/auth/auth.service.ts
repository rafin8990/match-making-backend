import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { JwtPayload, Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { jwtHelpers } from '../../../helper/jwtHelper'
import { sendEmail } from '../user/user.constant'
import { IUser } from '../user/user.interface'
import { User } from '../user/user.model'
import { sendVerificationCode } from './auth.constant'
import {
  IChangePassword,
  IForgetPassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IVerifyData,
} from './auth.interface'

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload
  const user = await User.findOne(
    { email: email },
    {
      password: 1,
      email: 1,
      role: 1,
      needsPasswordChange: 1,
      is2Authenticate: 1,
      isApproved: 1,
      verificationCode: 1,
      isFirstTime:1
    }
  )

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  const givenPassword = await bcrypt.compare(password, user?.password as string)

  if (!givenPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password did not match')
  }

  if (user.is2Authenticate === true) {
    const verificationCode = Math.floor(1000 + Math.random() * 9000)
    const subject = 'Your Verification Code'
    const text = `Your verification code is ${verificationCode}. Please enter this code to  your login your profile.`
    user.verificationCode = verificationCode
    await user.save()
    await sendVerificationCode(email, subject, text)
  }

  // Create access and refresh tokens
  const accessToken = jwtHelpers.createToken(
    {
      email: user.email,
      role: user.role,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      isApproved: user.isApproved,
      is2Authenticate: user.is2Authenticate,
      verificationCode: user.verificationCode,
      password: password,
      isFirstTime:user.isFirstTime,
      needsPasswordChange:user.needsPasswordChange
    },
    config.jwt_secret as string,
    config.jwt_expires_in as string
  )

  const refreshToken = jwtHelpers.createToken(
    {
      email: user.email,
      role: user.role,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      isApproved: user.isApproved,
      is2Authenticate: user.is2Authenticate,
      verificationCode: user.verificationCode,
      password: password,
      isFirstTime:user?.isFirstTime,
      needsPasswordChange:user.needsPasswordChange
    },
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
  // console.log(oldPassword,newPassword)
  const email = user?.email
  const isUserExist = await User.findOne({ email: email }, { password: 1})

  if (!isUserExist || !isUserExist.password) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User does not exist or password not set'
    )
  }

  const savedHashPassword = isUserExist.password

  const checkOldPassword = await bcrypt.compare(oldPassword, savedHashPassword)

  if (!checkOldPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password did not match')
  }

  // Hash new password
  const newHashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_sault_round)
  )

  const message = `Your Password changed successfully. Your new Password is ${newPassword}.Please do not shere your password with anyone.`

  const updatedData = {
    password: newHashPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
  }

  // Update password
  const updatedUser = await User.findOneAndUpdate(
    { email: email },
    {
      $set: updatedData,
    },
    { new: true } // return the updated document
  )

  await sendEmail(email, 'Your Password changed', message)

  if (!updatedUser) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update password'
    )
  }

  return updatedUser
}

const forgetPassword = async (
  payload: IForgetPassword
): Promise<IUser | null> => {
  const { email, newPassword, confirmPassword } = payload
  const users = new User()
  const isUserExist = await users.isUserExist(email)
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password didn't match")
  }
  // hash pass
  const newHashPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_sault_round)
  )

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

const verify2FA = async (
  userData: JwtPayload | null,
  verifyData: IVerifyData
): Promise<IUser> => {
  const { verificationCode } = verifyData
  const email = userData?.email

  if (!email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email not provided')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  const savedCode = user?.verificationCode
  const checkVerificationCode = Number(savedCode) === Number(verificationCode)

  if (!checkVerificationCode) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid verification code')
  }

  user.verificationCode = null
  await user.save()

  return user
}
export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  verify2FA,
}
