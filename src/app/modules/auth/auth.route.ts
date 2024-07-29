import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
const router = express.Router();

router.post('/login',validateRequest(AuthValidation.LoginZodSchema), AuthController.loginUser);
router.post('/refresh-token',validateRequest(AuthValidation.refreshTokenZodSchema), AuthController.refreshToken);
router.post('/change-password', validateRequest(AuthValidation.changePasswordZodSchema), AuthController.changePassword);
router.post('/forget-password', validateRequest(AuthValidation.forgetPasswordZodSchema), AuthController.forgetPassword);

export const LoginRoutes = router;
