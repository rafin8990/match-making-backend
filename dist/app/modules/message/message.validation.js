"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageValidation = void 0;
const zod_1 = require("zod");
const createMessageZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required"),
        content: zod_1.z.string().min(1, "Content is required"),
        isRead: zod_1.z.boolean(),
        files: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().email("Invalid email address"),
    }),
});
exports.MessageValidation = {
    createMessageZodSchema
};
