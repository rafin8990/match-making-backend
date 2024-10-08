"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_service_1 = require("./auth.service");
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = __rest(req.body, []);
    const result = yield auth_service_1.AuthService.loginUser(loginData);
    const { refreshToken } = result, others = __rest(result
    // set refresh token into the cookie
    , ["refreshToken"]);
    // set refresh token into the cookie
    const cookieOption = {
        secure: config_1.default.env === 'production' ? true : false,
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOption);
    // delete refresh token
    if ('refreshToken' in result) {
        delete result.refreshToken;
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User login Successfully',
        data: others,
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.AuthService.refreshToken(refreshToken);
    // set refresh token into the cookie
    const cookieOption = {
        secure: config_1.default.env === 'production' ? true : false,
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOption);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User Login Successfully',
        data: result,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordData = __rest(req.body, []);
    const token = req.headers.authorization;
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
    const user = (req.user = decoded);
    //    console.log(user)
    const result = yield auth_service_1.AuthService.changePassword(user, passwordData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password Changed Successfully',
        data: result,
    });
}));
const sendOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.AuthService.sendOTP(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OTP Sent Successfully',
        data: result,
    });
}));
const verifyOtpCode = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otpCode } = req.body;
    const result = yield auth_service_1.AuthService.verifyOtpCode(email, otpCode);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OTP Match Successfully',
        data: result,
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword, confirmPassword } = req.body;
    const result = yield auth_service_1.AuthService.resetPassword(email, newPassword, confirmPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password Changed Successfully',
        data: result,
    });
}));
const verify2FA = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyData = req.body;
    // const token = req.headers.authorization as string
    // const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload
    // const user = (req.user = decoded)
    // const email : any = verifyData.email
    const results = yield auth_service_1.AuthService.verify2FA(verifyData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Pin Matched Successfully',
        data: results,
    });
}));
const signOutUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('refreshToken');
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User signed out successfully',
    });
}));
// const forgetPassword = catchAsync(async (req: Request, res: Response) => {
//   const { ...passwordData } = req.body
//   // console.log(passwordData);
//   const token = req.headers.authorization as string
//   const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload
//   const user = (req.user = decoded)
//   //    console.log(user)
//   const result = await AuthService.forgetPassword(user, passwordData)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Password Changed Successfully',
//     data: result,
//   })
// })
// const verify2FA = async (req: Request, res: Response) => {
//   const { ...verifyData } = req.body
//   const token = req.headers.authorization as string
//   const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload
//   const user = (req.user = decoded)
//   const tokens = await AuthService.verify2FA(user,verifyData)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Pin Matched Successfully',
//     data: tokens,
//   })
// }
// const signOutUser = catchAsync(async (req: Request, res: Response) => {
//   res.clearCookie('refreshToken'); 
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User signed out successfully',
//   });
// });
exports.AuthController = {
    loginUser,
    refreshToken,
    changePassword,
    verify2FA,
    signOutUser,
    sendOTP,
    verifyOtpCode,
    resetPassword
};
