import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
const router = express.Router();

router.post('/login',validateRequest(AuthValidation.LoginZodSchema), AuthController.loginUser);
router.post('/refresh-token',validateRequest(AuthValidation.refreshTokenZodSchema), AuthController.refreshToken);
router.post('/change-password', validateRequest(AuthValidation.changePasswordZodSchema), AuthController.changePassword);

export const LoginRoutes = router;
