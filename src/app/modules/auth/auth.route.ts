import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthController } from './auth.controller'
import { AuthValidation } from './auth.validation'
const router = express.Router()

router.post(
  '/login',
  validateRequest(AuthValidation.LoginZodSchema),
  AuthController.loginUser
)
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
)
router.post(
  '/change-password',
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePassword
)
router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordZodSchema),
  AuthController.forgetPassword
)
router.post('/signout', AuthController.signOutUser)
router.post(
  '/verify-2FA',
  validateRequest(AuthValidation.verify2FAZodSchema),
  AuthController.verify2FA
)

export const LoginRoutes = router
