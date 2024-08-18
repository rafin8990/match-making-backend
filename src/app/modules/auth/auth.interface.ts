export type ILoginUser = {
  email: string
  password: string
}

export type ILoginUserResponse = {
  accessToken?: string
  refreshToken?: string
  needsPasswordChange?: boolean
}

export type IRefreshTokenResponse = {
  accessToken: string
}

export type IChangePassword = {
  oldPassword: string
  newPassword: string
}
export type IForgetPassword = {
  email:string
  newPassword: string
  confirmPassword:string
}

export type IVerifyData = {
  email: string
  verificationCode: number
}
