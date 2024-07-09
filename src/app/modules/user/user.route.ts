import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.post(
  '/create-user',
  validateRequest(UserValidation.createUserZodSchema),
  userController.createUser,
);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getSingleUser);
router.patch('/update/:id',validateRequest(UserValidation.UpdateUserZodSchema), userController.updateUser);
router.delete('/delete-user/:id', userController.deleteUser);

export const userRoutes = router;
