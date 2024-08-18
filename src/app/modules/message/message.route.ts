import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { MessageController } from './message.controller'
import { MessageValidation } from './message.validation'

const router = express.Router()

router.post(
    '/create-user',validateRequest(MessageValidation.createMessageZodSchema),MessageController.createMessage)
router.get('/', MessageController.getAllMessage)
router.get('/:id', MessageController.getSingleMessage)
router.patch('/update-message/:id', MessageController.updateMessage)
router.delete('/delete-message/:id', MessageController.deleteMessage)



export const MessageRoutes = router