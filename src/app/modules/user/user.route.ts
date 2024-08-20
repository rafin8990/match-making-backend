import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { userController } from './user.controller'
import { UserValidation } from './user.validation'
const router = express.Router()

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodSchema),
  userController.createUser
)

router.get('/', userController.getAllUsers)
router.get('/:id', userController.getSingleUser)
router.get('/email/:email', userController.getUserByEmail)
router.patch(
  '/update/:id',
  validateRequest(UserValidation.UpdateUserZodSchema),
  userController.updateUser
)
router.patch('/submit-update/:id', userController.submitUserUpdate)
router.patch('/approve-update/:id', userController.approveUserUpdate)
router.patch('/decline-update/:id', userController.declineUserUpdate)
router.patch('/update-photo/:id', userController.updatephoto)
router.delete('/delete-user/:id', userController.deleteUser)
router.patch('/toggle-2fa/:id', userController.toggleTwoFactor)

export const userRoutes = router
