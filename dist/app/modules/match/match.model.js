"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const mongoose_1 = require("mongoose");
const matchSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    matchesUserId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Match = (0, mongoose_1.model)('Match', matchSchema);
