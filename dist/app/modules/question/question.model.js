"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const mongoose_1 = require("mongoose");
const question_interface_1 = require("./question.interface");
const questionSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    type: {
        type: String,
        enum: Object.values(question_interface_1.QuestionType),
        required: true,
    },
    options: [{ type: String }],
    answer: { type: String },
}, {
    timestamps: true,
});
exports.Question = (0, mongoose_1.model)('Question', questionSchema);
