"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.LoginZodSchema), auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenZodSchema), auth_controller_1.AuthController.refreshToken);
router.post('/change-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.changePasswordZodSchema), auth_controller_1.AuthController.changePassword);
router.post('/forget-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.forgetPasswordZodSchema), auth_controller_1.AuthController.forgetPassword);
router.post('/signout', auth_controller_1.AuthController.signOutUser);
router.post('/verify-2FA', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.verify2FAZodSchema), auth_controller_1.AuthController.verify2FA);
exports.LoginRoutes = router;
