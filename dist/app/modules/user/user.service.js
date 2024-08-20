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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.User.findOne({ email: user.email });
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email Already exists');
    }
    const password2 = (0, user_constant_1.generateRandomPassword)();
    const hashedPassword = yield bcrypt_1.default.hash(password2, Number(config_1.default.bycrypt_sault_round));
    user.password = hashedPassword;
    user.isVerified = false;
    user.isApproved = false;
    user.role = 'user';
    yield (0, user_constant_1.sendEmail)(user.email, 'Welcome to Match Making Platform', `WelCome To matchmaking Platform . Your password is: ${password2}`);
    const result = yield user_model_1.User.create(user);
    return result;
});
const getAllUsers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
        const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
        const andConditions = [];
        console.log('data', searchTerm);
        if (searchTerm) {
            andConditions.push({
                $or: user_constant_1.UserSearchableFields.map(field => ({
                    [field]: {
                        $regex: searchTerm,
                        $options: 'i',
                    },
                })),
            });
        }
        if (Object.keys(filtersData).length) {
            andConditions.push({
                $and: Object.entries(filtersData).map(([field, value]) => ({
                    [field]: value,
                })),
            });
        }
        const sortConditions = {};
        if (sortBy && sortOrder) {
            sortConditions[sortBy] = sortOrder;
        }
        const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
        const users = yield user_model_1.User.find(whereConditions)
            .sort(sortConditions)
            .skip(skip)
            .limit(limit);
        const total = yield user_model_1.User.countDocuments(whereConditions);
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: users,
        };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Unable to retrieve users`);
    }
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        return user;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to retrieve user');
    }
});
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find user by email
        const user = yield user_model_1.User.findOne({ email }).lean(); // Use lean() for better performance
        // console.log('User:', user);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        return user;
    }
    catch (error) {
        console.error('Error retrieving user:', error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to retrieve user');
    }
});
const updateUser = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        return user;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to update user');
    }
});
const submitUserUpdate = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (updateData.selectedImage) {
        user.selectedImage = updateData.selectedImage;
        if (user.images && user.images.length >= 5) {
            user.images.shift();
        }
        (_a = user.images) === null || _a === void 0 ? void 0 : _a.push(updateData.selectedImage);
    }
    user.pendingUpdates = Object.assign(Object.assign({}, user.pendingUpdates), updateData);
    user.isUpdated = false;
    yield user.save();
    return user;
});
const approveUserUpdate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    // console.log(user)
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    user.isApproved = true;
    if (user.pendingUpdates) {
        Object.assign(user, user.pendingUpdates);
        user.pendingUpdates = undefined;
        user.isUpdated = true;
        yield user.save();
    }
    yield user.save();
    return user;
});
const declineUserUpdate = (id, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    user.pendingUpdates = undefined;
    user.isUpdated = false;
    user.updateStatusMessage = `Update request declined: ${reason}`;
    yield user.save();
    yield (0, user_constant_1.sendEmail)(user.email, 'Update Request Declined', user.updateStatusMessage);
    return user;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findByIdAndDelete(id);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        return user;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to delete user');
    }
});
const updatePhoto = (id, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        yield user.addImage(imageUrl);
        return user;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to update photo');
    }
});
const toggleTwoFactorAuthentication = (id, enable) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        user.is2Authenticate = enable;
        yield user.save();
        return user;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to update two-factor authentication status');
    }
});
exports.UserService = {
    createUser,
    getAllUsers,
    getSingleUser,
    getUserByEmail,
    updateUser,
    submitUserUpdate,
    approveUserUpdate,
    declineUserUpdate,
    deleteUser,
    updatePhoto,
    toggleTwoFactorAuthentication
};
