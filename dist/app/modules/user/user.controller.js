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
exports.userController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pagination_1 = require("../../constants/pagination");
const user_constant_1 = require("./user.constant");
const user_service_1 = require("./user.service");
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const result = yield user_service_1.UserService.createUser(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User created successfully',
        success: true,
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = Object.assign(Object.assign({}, (0, pick_1.default)(req.query, user_constant_1.UserFilterableFields)), { searchTerm: req.query.searchTerm });
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield user_service_1.UserService.getAllUsers(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Users retrieved successfully',
        success: true,
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    // console.log('userId', userId)
    const result = yield user_service_1.UserService.getSingleUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User retrieved successfully',
        success: true,
        data: result,
    });
}));
const getUserByEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = req.params.email;
    // console.log('userId', userEmail)
    const result = yield user_service_1.UserService.getUserByEmail(userEmail);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User retrieved successfully',
        success: true,
        data: result,
    });
}));
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const updateData = req.body;
    const result = yield user_service_1.UserService.updateUser(userId, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User updated successfully',
        success: true,
        data: result,
    });
}));
const submitUserUpdate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const updateData = req.body;
    const result = yield user_service_1.UserService.submitUserUpdate(userId, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User update submitted successfully. Pending admin approval.',
        success: true,
        data: result,
    });
}));
const approveUserUpdate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield user_service_1.UserService.approveUserUpdate(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User update approved successfully.',
        success: true,
        data: result,
    });
}));
const declineUserUpdate = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { reason } = req.body;
    const result = yield user_service_1.UserService.declineUserUpdate(userId, reason);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User update request declined.',
        success: true,
        data: result,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield user_service_1.UserService.deleteUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User deleted successfully',
        success: true,
        data: result,
    });
}));
const updatephoto = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const imageUrl = req.body;
    const result = yield user_service_1.UserService.updatePhoto(id, imageUrl);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User photo updated successfully',
        success: true,
        data: result,
    });
}));
const toggleTwoFactor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { enable } = req.body;
    const result = yield user_service_1.UserService.toggleTwoFactorAuthentication(id, enable);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: `Two-factor authentication ${enable ? 'enabled' : 'disabled'} successfully`,
        success: true,
        data: result,
    });
}));
exports.userController = {
    createUser,
    getAllUsers,
    getUserByEmail,
    getSingleUser,
    updateUser,
    submitUserUpdate,
    approveUserUpdate,
    declineUserUpdate,
    deleteUser,
    updatephoto,
    toggleTwoFactor
};
