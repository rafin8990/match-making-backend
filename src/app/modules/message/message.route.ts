import express from 'express'
import { ENUM_USER_ROLE } from '../../enums/users'
import auth from '../../middlewares/auth'
import { MessageController } from './message.controller'

const router = express.Router()

router.post('/create-message', MessageController.createMessage);
router.post('/create-invite-message', MessageController.createInviteMessage);
router.get('/', auth(ENUM_USER_ROLE.ADMIN),MessageController.getAllMessage);
router.get('/:id',auth(ENUM_USER_ROLE.ADMIN), MessageController.getSingleMessage);
router.patch('/update-message/:id',auth(ENUM_USER_ROLE.ADMIN), MessageController.updateMessage);
router.delete('/delete-message/:id',auth(ENUM_USER_ROLE.ADMIN), MessageController.deleteMessage);

export const MessageRoutes = router
