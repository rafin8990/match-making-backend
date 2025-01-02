/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import httpStatus from 'http-status'
import { JwtPayload, Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { jwtHelpers } from '../../../helper/jwtHelper'
import { sendEmail, sendOTPEmail } from '../user/user.constant'
import { IUser } from '../user/user.interface'
import { User } from '../user/user.model'
// import Image from '../../../../public/logo1.png'
// import { sendVerificationCode } from './auth.constant'
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IVerifyData,
} from './auth.interface'


const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  // Find the user in the database
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
      isFirstTime: 1,
      isDisabled: 1,
    }
  );

  // Handle errors for missing user or password mismatch
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const givenPassword = await bcrypt.compare(password, user?.password as string);

  if (!givenPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password did not match');
  }

  if (user.isDisabled) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Your ID is disabled.');
  }

  // If two-factor authentication is required
  if (user.is2Authenticate) {
    // Immediate response
    const response = {
      isTwoAuthenticate: true,
      email: user.email,
      message: 'An authentication code will be sent to your email shortly.',
    };

    // Async OTP generation and email sending
    setImmediate(async () => {
      try {
        const otpCode = Math.floor(1000 + Math.random() * 9000);
        const otpExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);


        user.otpCode = otpCode;
        user.otpExpiration = otpExpiration;
        await user.save();
        await sendOTPEmail(
          email,
          'Your Authentication Code',
          otpCode
        );
        console.log('OTP email sent successfully.');
      } catch (error) {
        console.error('Error sending OTP email:', error);
      }
    });
    // io.emit('notification', { message: `New Login ${user.email}` })
    return response; // Send response before OTP and email logic completes
  }

  // If no two-factor authentication is required, proceed with generating tokens
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
      isFirstTime: user.isFirstTime,
      needsPasswordChange: user.needsPasswordChange,
    },
    config.jwt_secret as string,
    config.jwt_expires_in as string
  );

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
      isFirstTime: user.isFirstTime,
      needsPasswordChange: user.needsPasswordChange,
    },
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
  };
};


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
  const isUserExist = await User.findOne({ email: email }, { password: 1 })

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

const sendOTP = async (email: string): Promise<IUser | null> => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Does not exist')
  }

  const otpCode = crypto.randomInt(1000, 9999).toString()
  const otpExpiration = new Date(Date.now() + 2 * 60 * 1000)
  // console.log('data', otpCode, user)
  user.otpCode = Number(otpCode)
  user.otpExpiration = otpExpiration
  await user.save()
  const message = `Your OTP Verification code is ${otpCode}. This code is expired in two minutes.`
  sendEmail(email, 'You Received an OTP Code', message)
  return user
}

const verifyOtpCode = async (
  email: string,
  otpCode: number
): Promise<IUser | null> => {
  // console.log('data', email, otpCode)
  const user = await User.findOne({ email })
  const date = new Date()
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  if (user.otpCode !== otpCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, ' OTP code did not match')
  }
  if (user.otpExpiration! < date) {
    throw new ApiError(httpStatus.BAD_REQUEST, ' OTP code Expired')
  }

  user.otpCode = undefined
  user.otpExpiration = undefined
  await user.save()
  return user
}

const resetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string
): Promise<IUser | null> => {
  const user = await User.findOne({ email }, { password: 1 })
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  if (newPassword !== confirmPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password did not match')
  }
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bycrypt_sault_round)
  )
  user.password = hashedPassword
  await user.save()
  return user
}

// const verify2FA = async (verifyData: IVerifyData): Promise<IUser> => {
//   const { verificationCode } = verifyData
//   const email = verifyData?.email
//   console.log(email)

//   // console.log('data',verificationCode, email)
//   if (!email) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Email not provided')
//   }

//   const user = await User.findOne({ email })

//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
//   }

//   const savedCode = user?.otpCode
//   // console.log('data', savedCode, verificationCode)
//   const checkVerificationCode = Number(savedCode) === Number(verificationCode)

//   if (!checkVerificationCode) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid verification code')
//   }

//   user.otpCode = undefined
//   user.verificationCode = null
//   await user.save()

//   return user
// }



const verify2FA = async (
  verifyData: IVerifyData
): Promise<ILoginUserResponse> => {
  const { email, verificationCode } = verifyData

  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is required')
  }

  if (!verificationCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Verification code is required')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  if (!user.otpCode || !user.otpExpiration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'No active OTP found for this user'
    )
  }

  if (user.otpExpiration < new Date()) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'OTP has expired. Please request a new one.'
    )
  }

  const isCodeValid = Number(user.otpCode) === Number(verificationCode)

  if (!isCodeValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid verification code')
  }

  user.otpCode = undefined
  user.otpExpiration = undefined
  await user.save()

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
      isFirstTime: user.isFirstTime,
      needsPasswordChange: user.needsPasswordChange,
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
      isFirstTime: user?.isFirstTime,
      needsPasswordChange: user.needsPasswordChange,
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

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  verify2FA,
  sendOTP,
  verifyOtpCode,
  resetPassword,
}
