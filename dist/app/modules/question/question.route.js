"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const question_controller_1 = require("./question.controller");
const router = express_1.default.Router();
router.post("/", question_controller_1.QuestionController.createQuestion);
router.get("/", question_controller_1.QuestionController.getAllQuestions);
router.get("/:id", question_controller_1.QuestionController.getSingleQuestion);
router.patch("/:id", question_controller_1.QuestionController.updateQuestion);
router.delete("/:id", question_controller_1.QuestionController.deleteQuestion);
exports.QuestionRoutes = router;
