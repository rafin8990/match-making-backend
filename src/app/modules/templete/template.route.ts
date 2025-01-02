import express from 'express';
import { TemplateController } from './template.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../enums/users';

const router = express.Router()


router.get('/',auth(ENUM_USER_ROLE.ADMIN), TemplateController.getAllTemplates)
router.post('/create-template',auth(ENUM_USER_ROLE.ADMIN), TemplateController.createTemplate)
router.get("/:id",auth(ENUM_USER_ROLE.ADMIN), TemplateController.getSingleTemplate);
router.patch("/:id",auth(ENUM_USER_ROLE.ADMIN), TemplateController.updateTemplate);
router.delete("/:id",auth(ENUM_USER_ROLE.ADMIN), TemplateController.deleteTemplate);


export const TemplateRoutes = router