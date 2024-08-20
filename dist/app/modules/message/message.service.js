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
exports.MessageService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const user_constant_1 = require("../user/user.constant");
const message_constant_1 = require("./message.constant");
const message_model_1 = require("./message.model");
const createMessage = (messageData) => __awaiter(void 0, void 0, void 0, function* () {
    const message = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    ${messageData.content}
</body>
</html>`;
    yield (0, user_constant_1.sendEmail)(messageData.email, 'You received an message from Admin', message);
    const result = yield message_model_1.Message.create(messageData);
    return result;
});
const getAllMessage = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
        const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
        const andConditions = [];
        if (searchTerm) {
            andConditions.push({
                $or: message_constant_1.MessageSearchableFields.map(field => ({
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
        const messages = yield message_model_1.Message.find(whereConditions)
            .sort(sortConditions)
            .skip(skip)
            .limit(limit);
        const total = yield message_model_1.Message.countDocuments(whereConditions);
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: messages,
        };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Unable to retrieve users`);
    }
});
const getSingleMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield message_model_1.Message.findById(id);
        if (!message) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Message not found');
        }
        return message;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to retrieve message');
    }
});
const updateMessage = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield message_model_1.Message.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!message) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        return message;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to update message');
    }
});
const deleteMessage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield message_model_1.Message.findByIdAndDelete(id);
        if (!message) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'message not found');
        }
        return message;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Unable to delete message');
    }
});
exports.MessageService = {
    createMessage,
    getAllMessage,
    getSingleMessage,
    updateMessage,
    deleteMessage,
};
