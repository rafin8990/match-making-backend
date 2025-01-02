import express from "express";
import { AnswerController } from "./answer.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/users";



const router = express.Router();

router.post("/",auth(ENUM_USER_ROLE.ADMIN), AnswerController.createAnswer);
router.get("/",auth(ENUM_USER_ROLE.ADMIN), AnswerController.getAllAnswer);
router.get("/:id",auth(ENUM_USER_ROLE.ADMIN), AnswerController.getSingleAnswer);
router.patch("/:id",auth(ENUM_USER_ROLE.ADMIN), AnswerController.updateAnswer);
router.delete("/:id",auth(ENUM_USER_ROLE.ADMIN), AnswerController.deleteAnswer);

export const AnswerRoutes = router;
