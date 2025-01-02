import express from 'express'
import { NotificationController } from './notification.controller'

const router = express.Router()

router.post('/create-notification', NotificationController.createNotification)
router.post(
  '/create-invite-notification',
  NotificationController.createInviteNotification
)
router.get('/', NotificationController.getAllNotification)
router.get('/:id', NotificationController.getSingleNotification)
router.patch(
  '/update-notification/:id',
  NotificationController.updateNotification
)
router.delete(
  '/delete-notification/:id',
  NotificationController.deleteNotification
)

export const NotificationRoutes = router
