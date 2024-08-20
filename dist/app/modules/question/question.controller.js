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
exports.QuestionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pagination_1 = require("../../constants/pagination");
const question_constant_1 = require("./question.constant");
const question_service_1 = require("./question.service");
const createQuestion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const question = req.body;
    const result = yield question_service_1.QuestionService.createQuestion(question);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Question created successfully",
        success: true,
        data: result,
    });
}));
const getAllQuestions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = Object.assign(Object.assign({}, (0, pick_1.default)(req.query, question_constant_1.QuestionFilterableFields)), { searchTerm: req.query.searchTerm });
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield question_service_1.QuestionService.getAllQuestions(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Questions retrieved successfully",
        success: true,
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleQuestion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const questionId = req.params.id;
    const result = yield question_service_1.QuestionService.getSingleQuestion(questionId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Question retrieved successfully",
        success: true,
        data: result,
    });
}));
const updateQuestion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const questionId = req.params.id;
    const updateData = req.body;
    const result = yield question_service_1.QuestionService.updateQuestion(questionId, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Question updated successfully",
        success: true,
        data: result,
    });
}));
const deleteQuestion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const questionId = req.params.id;
    const result = yield question_service_1.QuestionService.deleteQuestion(questionId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Question deleted successfully",
        success: true,
        data: result,
    });
}));
exports.QuestionController = {
    createQuestion,
    getAllQuestions,
    getSingleQuestion,
    updateQuestion,
    deleteQuestion,
};
