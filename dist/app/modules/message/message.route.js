"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("./message.controller");
const router = express_1.default.Router();
router.post('/create-message', message_controller_1.MessageController.createMessage);
router.get('/', message_controller_1.MessageController.getAllMessage);
router.get('/:id', message_controller_1.MessageController.getSingleMessage);
router.patch('/update-message/:id', message_controller_1.MessageController.updateMessage);
router.delete('/delete-message/:id', message_controller_1.MessageController.deleteMessage);
exports.MessageRoutes = router;
