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
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelper_1 = require("../../../helper/jwtHelper");
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
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    const givenPassword = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
    // console.log(givenPassword)
    if (!givenPassword) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password did not match');
    }
    if (user.is2Authenticate === true) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const subject = 'Your Verification Code';
        const text = `Your verification code is ${verificationCode}. Please enter this code to  your login your profile.`;
        user.verificationCode = verificationCode;
        yield user.save();
        yield (0, auth_constant_1.sendVerificationCode)(email, subject, text);
    }
    // Create access and refresh tokens
    const accessToken = jwtHelper_1.jwtHelpers.createToken({ email: user.email, role: user.role, id: user._id, name: user.name, isApproved: user.isApproved }, config_1.default.jwt_secret, config_1.default.jwt_expires_in);
    const refreshToken = jwtHelper_1.jwtHelpers.createToken({ email: user.email, role: user.role, id: user._id, name: user.name, isApproved: user.isApproved }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
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
    const users = new user_model_1.User();
    const isUserExist = yield users.isUserExist(user === null || user === void 0 ? void 0 : user.email);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // checking old pass
    const passwordMatched = users.isPasswordMatched(oldPassword, isUserExist.password);
    if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password) && !passwordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Old Password did not matched');
    }
    // hash pass
    const newHashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bycrypt_sault_round));
    const email = user === null || user === void 0 ? void 0 : user.email;
    const updatedData = {
        password: newHashPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    };
    // update password
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ email: email }, {
        $set: updatedData,
    });
    if (!updatedUser) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update password');
    }
    return updatedUser;
});
const forgetPassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword } = payload;
    const users = new user_model_1.User();
    const isUserExist = yield users.isUserExist(user === null || user === void 0 ? void 0 : user.email);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    // hash pass
    const newHashPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bycrypt_sault_round));
    const email = user === null || user === void 0 ? void 0 : user.email;
    const updatedData = {
        password: newHashPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    };
    // update password
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ email: email }, {
        $set: updatedData,
    });
    if (!updatedUser) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update password');
    }
    return updatedUser;
});
const verify2FA = (userData, verifyData) => __awaiter(void 0, void 0, void 0, function* () {
    const { verificationCode } = verifyData;
    const email = userData === null || userData === void 0 ? void 0 : userData.email;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (user.verificationCode !== verificationCode) {
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
    forgetPassword,
    verify2FA,
};
