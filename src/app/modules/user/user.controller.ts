import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { paginationFields } from '../../constants/pagination'
import { IUserFilter, UserFilterableFields } from './user.constant'
import { IUser } from './user.interface'
import { UserService } from './user.service'

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.body
  const result = await UserService.createUser(user)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User created successfully',
    success: true,
    data: result,
  })
})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters: IUserFilter = {
    ...pick(req.query, UserFilterableFields),
    searchTerm: req.query.searchTerm as string,
  }
  const paginationOptions = pick(req.query, paginationFields)

  const result = await UserService.getAllUsers(filters, paginationOptions)

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
    success: true,
    meta: result.meta,
    data: result.data,
  })
})

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id
  const result = await UserService.getSingleUser(userId)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    message: 'User retrieved successfully',
    success: true,
    data: result,
  })
})

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id
  const updateData = req.body 
  console.log(updateData)
  const result = await UserService.updateUser(userId, updateData)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    success: true,
    data: result,
  })
})

const submitUserUpdate = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id
  const updateData: Partial<IUser> = req.body
  // console.log(userId,updateData)

  const result = await UserService.submitUserUpdate(userId, updateData)
  // console.log(result)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    message: 'User update submitted successfully. Pending admin approval.',
    success: true,
    data: result,
  })
})

const approveUserUpdate = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id
  const result = await UserService.approveUserUpdate(userId)
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    message: 'User update approved successfully.',
    success: true,
    data: result,
  })
})

const declineUserUpdate = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { reason } = req.body;

  const result = await UserService.declineUserUpdate(userId, reason);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    message: 'User update request declined.',
    success: true,
    data: result,
  });
});



const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id
  const result = await UserService.deleteUser(userId)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    message: 'User deleted successfully',
    success: true,
    data: result,
  })
})

const updatephoto = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const imageUrl = req.body
  const result = await UserService.updatePhoto(id, imageUrl)

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    message: 'User photo updated successfully',
    success: true,
    data: result,
  })
})

const toggleTwoFactor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { enable } = req.body;
  const result = await UserService.toggleTwoFactorAuthentication(id, enable);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    message: `Two-factor authentication ${enable ? 'enabled' : 'disabled'} successfully`,
    success: true,
    data: result,
  });
});
export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  submitUserUpdate,
  approveUserUpdate,
  declineUserUpdate,
  deleteUser,
  updatephoto,
  toggleTwoFactor
}
