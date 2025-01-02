import express from 'express'
import { ENUM_USER_ROLE } from '../../enums/users'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { userController } from './user.controller'
import { UserValidation } from './user.validation'
const router = express.Router()

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodSchema),
  userController.createUser
)

router.get('/',auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER), userController.getAllUsers);
router.get('/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), userController.getSingleUser);
router.get('/email/:email',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), userController.getUserByEmail);
router.patch('/update/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), userController.updateUser);
router.patch('/submit-update/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), userController.submitUserUpdate);
router.patch('/approve-update/:id',auth(ENUM_USER_ROLE.ADMIN), userController.approveUserUpdate);
router.patch('/decline-update/:id',auth(ENUM_USER_ROLE.ADMIN), userController.declineUserUpdate);
router.patch('/update-photo/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), userController.updatephoto);
router.patch('/update-admin-photo/:id',auth(ENUM_USER_ROLE.ADMIN), userController.updateAdminphoto);
router.patch('/selected-photo/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), userController.selectedphoto);
router.patch('/remove-photo/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), userController.removeSelectedphoto);
router.delete('/delete-photo/:id',auth(ENUM_USER_ROLE.ADMIN,ENUM_USER_ROLE.USER), userController.deletephoto);
router.delete('/delete-user/:id',auth(ENUM_USER_ROLE.ADMIN), userController.deleteUser);
router.patch('/toggle-2fa/:id', userController.toggleTwoFactor);
router.patch('/make-admin/:id',auth(ENUM_USER_ROLE.ADMIN), userController.makeAdmin);
router.patch('/remove-admin/:id',auth(ENUM_USER_ROLE.ADMIN), userController.removeAdmin);
router.patch('/make-disabled/:id',auth(ENUM_USER_ROLE.ADMIN), userController.makeDisabled);
router.patch('/remove-disabled/:id',auth(ENUM_USER_ROLE.ADMIN), userController.removeDisabled);

export const userRoutes = router
