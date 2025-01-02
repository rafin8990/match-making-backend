import express from "express";
import { ENUM_USER_ROLE } from "../../enums/users";
import auth from "../../middlewares/auth";
import { QuestionController } from "./question.controller";

const router = express.Router();

router.post("/",auth(ENUM_USER_ROLE.ADMIN), QuestionController.createQuestion);
router.get("/",auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), QuestionController.getAllQuestions);
router.get("/:id",auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), QuestionController.getSingleQuestion);
router.patch("/:id",auth(ENUM_USER_ROLE.ADMIN), QuestionController.updateQuestion);
router.delete("/:id",auth(ENUM_USER_ROLE.ADMIN), QuestionController.deleteQuestion);

export const QuestionRoutes = router;
