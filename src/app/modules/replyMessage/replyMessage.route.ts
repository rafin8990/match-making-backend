import express from 'express'
import { ENUM_USER_ROLE } from '../../enums/users'
import auth from '../../middlewares/auth'
import { ReplyMessageController } from './replyMessage.controller'

const router = express.Router()

router.post('/create-reply',auth(ENUM_USER_ROLE.ADMIN), ReplyMessageController.createReplyMessage)
router.get('/',auth(ENUM_USER_ROLE.ADMIN), ReplyMessageController.getAllReplyMessage)
router.get('/:id',auth(ENUM_USER_ROLE.ADMIN), ReplyMessageController.getSingleReplyMessage)
router.patch('/update-message/:id',auth(ENUM_USER_ROLE.ADMIN), ReplyMessageController.updateReplyMessage)
router.delete('/delete-message/:id',auth(ENUM_USER_ROLE.ADMIN), ReplyMessageController.deleteReplyMessage)

export const ReplyMessageRoutes = router
