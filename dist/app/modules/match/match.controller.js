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
exports.MatchMakingController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const match_service_1 = require("./match.service");
const getAllMatchs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all matches
        const result = yield match_service_1.MatchMakingService.getAllMatchs();
        // Send response
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            message: 'Users match retrieved successfully',
            success: true,
            data: result,
        });
    }
    catch (error) {
        // Handle unexpected errors
        console.error('Error retrieving matches:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: 'An error occurred while retrieving matches',
            success: false,
            data: null,
        });
    }
}));
const getAllMatchesWithUserDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve all matches
        const result = yield match_service_1.MatchMakingService.getAllMatchesWithUserDetails();
        // Send response
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            message: 'Users match retrieved successfully',
            success: true,
            data: result,
        });
    }
    catch (error) {
        // Handle unexpected errors
        console.error('Error retrieving matches:', error);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            message: 'An error occurred while retrieving matches',
            success: false,
            data: null,
        });
    }
}));
const getUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield match_service_1.MatchMakingService.getUserDetails(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User retrieved successfully',
        success: true,
        data: result,
    });
}));
const getSuggestions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield match_service_1.MatchMakingService.getUserDetails(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid User ID');
    }
    const suggestedUsers = yield match_service_1.MatchMakingService.getSuggestedUsers(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Suggested Users retrieved successfully',
        success: true,
        meta: suggestedUsers.meta,
        data: suggestedUsers.data,
    });
}));
const createMatch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, suggestedUserId } = req.body;
    // console.log('userId', userId, suggestedUserId)
    const result = yield match_service_1.MatchMakingService.createMatch(userId, suggestedUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Match request sent successfully',
        success: true,
        data: result,
    });
}));
const resendMatch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, suggestedUserId } = req.body;
    // console.log('userId', userId, suggestedUserId)
    const result = yield match_service_1.MatchMakingService.resendMatch(userId, suggestedUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Match request sent successfully',
        success: true,
        data: result,
    });
}));
const UpdateMatch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, suggestedUserId } = req.body;
    // console.log('userId', userId, suggestedUserId)
    const result = yield match_service_1.MatchMakingService.UpdateMatch(userId, suggestedUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Match request sent successfully',
        success: true,
        data: result,
    });
}));
const UpdateUnmatch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    // console.log('userId', id)
    const result = yield match_service_1.MatchMakingService.UpdateUnmatch(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Unmatch request sent successfully',
        success: true,
        data: result,
    });
}));
const handleAccept = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, matchUserId, action } = req.body;
    const result = yield match_service_1.MatchMakingService.handleAccept(userId, matchUserId, action);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: `Match response '${action}' recorded successfully`,
        success: true,
        data: result,
    });
}));
exports.MatchMakingController = {
    getAllMatchs,
    getAllMatchesWithUserDetails,
    UpdateMatch,
    getUser,
    getSuggestions,
    createMatch,
    resendMatch,
    handleAccept,
    UpdateUnmatch,
};
