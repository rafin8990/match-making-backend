import express from 'express'
import { MessageController } from './message.controller'


const router = express.Router()

router.post(
    '/create-message',MessageController.createMessage)
router.get('/', MessageController.getAllMessage)
router.get('/:id', MessageController.getSingleMessage)
router.patch('/update-message/:id', MessageController.updateMessage)
router.delete('/delete-message/:id', MessageController.deleteMessage)



export const MessageRoutes = router