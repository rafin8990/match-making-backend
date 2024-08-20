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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelper_1 = require("../../../helper/jwtHelper");
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const auth_constant_1 = require("./auth.constant");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield user_model_1.User.findOne({ email: email }, {
        password: 1,
        email: 1,
        role: 1,
        needsPasswordChange: 1,
        is2Authenticate: 1,
        isApproved: 1,
        verificationCode: 1,
        isFirstTime: 1,
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    const givenPassword = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
    if (!givenPassword) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password did not match');
    }
    if (user.is2Authenticate === true) {
        const verificationCode = Math.floor(1000 + Math.random() * 9000);
        const subject = 'Your Verification Code';
        const text = `Your verification code is ${verificationCode}. Please enter this code to  your login your profile.`;
        user.verificationCode = verificationCode;
        yield user.save();
        yield (0, auth_constant_1.sendVerificationCode)(email, subject, text);
    }
    // Create access and refresh tokens
    const accessToken = jwtHelper_1.jwtHelpers.createToken({
        email: user.email,
        role: user.role,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        isApproved: user.isApproved,
        is2Authenticate: user.is2Authenticate,
        verificationCode: user.verificationCode,
        password: password,
        isFirstTime: user.isFirstTime,
        needsPasswordChange: user.needsPasswordChange,
    }, config_1.default.jwt_secret, config_1.default.jwt_expires_in);
    const refreshToken = jwtHelper_1.jwtHelpers.createToken({
        email: user.email,
        role: user.role,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        isApproved: user.isApproved,
        is2Authenticate: user.is2Authenticate,
        verificationCode: user.verificationCode,
        password: password,
        isFirstTime: user === null || user === void 0 ? void 0 : user.isFirstTime,
        needsPasswordChange: user.needsPasswordChange,
    }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user.needsPasswordChange,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_model_1.User();
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt_refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'invalid refresh token');
    }
    // checking deleted users refresh token
    const { email } = verifiedToken;
    const isUserExist = yield user.isUserExist(email);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // generate new token
    const newAccessToken = jwtHelper_1.jwtHelpers.createToken({ id: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email, role: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role }, config_1.default.jwt_secret, config_1.default.jwt_expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    // console.log(oldPassword,newPassword)
    const email = user === null || user === void 0 ? void 0 : user.email;
    const isUserExist = yield user_model_1.User.findOne({ email: email }, { password: 1 });
    if (!isUserExist || !isUserExist.password) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist or password not set');
    }
    const savedHashPassword = isUserExist.password;
    const checkOldPassword = yield bcrypt_1.default.compare(oldPassword, savedHashPassword);
    if (!checkOldPassword) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Old Password did not match');
    }
    // Hash new password
    const newHashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bycrypt_sault_round));
    const message = `Your Password changed successfully. Your new Password is ${newPassword}.Please do not shere your password with anyone.`;
    const updatedData = {
        password: newHashPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    };
    // Update password
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ email: email }, {
        $set: updatedData,
    }, { new: true } // return the updated document
    );
    yield (0, user_constant_1.sendEmail)(email, 'Your Password changed', message);
    if (!updatedUser) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update password');
    }
    return updatedUser;
});
const sendOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User Does not exist');
    }
    const otpCode = crypto_1.default.randomInt(1000, 9999).toString();
    const otpExpiration = new Date(Date.now() + 2 * 60 * 1000);
    // console.log('data', otpCode, user)
    user.otpCode = otpCode;
    user.otpExpiration = otpExpiration;
    yield user.save();
    const message = `Your OTP Verification code is ${otpCode}. This code is expired in two minutes.`;
    (0, user_constant_1.sendEmail)(email, 'You Received an OTP Code', message);
    return user;
});
const verifyOtpCode = (email, otpCode) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('data', email, otpCode);
    const user = yield user_model_1.User.findOne({ email });
    const date = new Date();
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (user.otpCode !== otpCode) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, ' OTP code did not match');
    }
    if (user.otpExpiration < date) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, ' OTP code Expired');
    }
    user.otpCode = undefined;
    user.otpExpiration = undefined;
    yield user.save();
    return user;
});
const resetPassword = (email, newPassword, confirmPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email }, { password: 1 });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (newPassword !== confirmPassword) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Password did not match');
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bycrypt_sault_round));
    user.password = hashedPassword;
    yield user.save();
    return user;
});
const verify2FA = (verifyData) => __awaiter(void 0, void 0, void 0, function* () {
    const { verificationCode } = verifyData;
    const email = verifyData === null || verifyData === void 0 ? void 0 : verifyData.email;
    // console.log('data',verificationCode, email)
    if (!email) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Email not provided');
    }
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    const savedCode = user === null || user === void 0 ? void 0 : user.otpCode;
    // console.log('data', savedCode, verificationCode)
    const checkVerificationCode = Number(savedCode) === Number(verificationCode);
    if (!checkVerificationCode) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid verification code');
    }
    user.verificationCode = null;
    yield user.save();
    return user;
});
exports.AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    verify2FA,
    sendOTP,
    verifyOtpCode,
    resetPassword,
};
