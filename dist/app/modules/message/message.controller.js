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
exports.MessageController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pagination_1 = require("../../constants/pagination");
const message_constant_1 = require("./message.constant");
const message_service_1 = require("./message.service");
const createMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Message = req.body;
    console.log(Message);
    const result = yield message_service_1.MessageService.createMessage(Message);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Message Sent successfully',
        success: true,
        data: result,
    });
}));
const getAllMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = Object.assign(Object.assign({}, (0, pick_1.default)(req.query, message_constant_1.MessageFilterableFields)), { searchTerm: req.query.searchTerm });
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield message_service_1.MessageService.getAllMessage(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Message retrieved successfully',
        success: true,
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messsageId = req.params.id;
    const result = yield message_service_1.MessageService.getSingleMessage(messsageId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Messsage retrieved successfully',
        success: true,
        data: result,
    });
}));
const updateMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const MessageId = req.params.id;
    const updateData = req.body;
    // console.log(updateData)
    const result = yield message_service_1.MessageService.updateMessage(MessageId, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Message updated successfully',
        success: true,
        data: result,
    });
}));
const deleteMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const MessageId = req.params.id;
    const result = yield message_service_1.MessageService.deleteMessage(MessageId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Message deleted successfully',
        success: true,
        data: result,
    });
}));
exports.MessageController = {
    createMessage,
    getAllMessage,
    getSingleMessage,
    updateMessage,
    deleteMessage
};
