import express from "express";
import { NoteController } from "./note.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../enums/users";


const router = express.Router();

router.post("/",auth(ENUM_USER_ROLE.ADMIN), NoteController.createNote);
router.get("/",auth(ENUM_USER_ROLE.ADMIN), NoteController.getAllNote);
router.get("/:id",auth(ENUM_USER_ROLE.ADMIN), NoteController.getSingleNote);
router.patch("/:id",auth(ENUM_USER_ROLE.ADMIN), NoteController.updateNote);
router.delete("/:id",auth(ENUM_USER_ROLE.ADMIN), NoteController.deleteNote);

export const NoteRoutes = router;
