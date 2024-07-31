import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { SortOrder } from 'mongoose'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { paginationHelpers } from '../../../helper/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import {
  generateRandomPassword,
  IUserFilter,
  sendEmail,
  UserSearchableFields,
} from './user.constant'
import { IUser } from './user.interface'
import { User } from './user.model'

const createUser = async (user: IUser): Promise<IUser> => {
  const existingUser = await User.findOne({ email: user.email })

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email Already exists')
  }

  const password2 = generateRandomPassword();

  const hashedPassword = await bcrypt.hash(
    password2,
    Number(config.bycrypt_sault_round)
  )
  user.password = hashedPassword 
  user.isVerified=false
  user.isApproved=false 
  user.role= 'user'
  await sendEmail(
    user.email,
    'Welcome to Match Making Platform',
    `WelCome To matchmaking Platform . Your password is: ${password2}`
  )
  const result = await User.create(user)
  return result
}

const getAllUsers = async (
  filters: IUserFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  try {
    const { searchTerm, ...filtersData } = filters
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(paginationOptions)
    const andConditions = []
    if (searchTerm) {
      andConditions.push({
        $or: UserSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      })
    }

    if (Object.keys(filtersData).length) {
      andConditions.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      })
    }

    const sortConditions: { [key: string]: SortOrder } = {}

    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder
    }
    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {}
    const users = await User.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments(whereConditions)
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: users,
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Unable to retrieve users`
    )
  }
}

const getSingleUser = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to retrieve user'
    )
  }
}

const updateUser = async (
  id: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  try {
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,                           
    })
   
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to update user'
    )
  }
}

const submitUserUpdate = async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  user.pendingUpdates = { ...user.pendingUpdates, ...updateData };
  user.isUpdated = false;
  await user.save();

  return user;
};


const deleteUser = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to delete user'
    )
  }
}

const approveUserUpdate = async (id: string): Promise<IUser | null> => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.pendingUpdates) {
    Object.assign(user, user.pendingUpdates);
    user.pendingUpdates = undefined;
    user.isApproved = true; // Mark as approved
    await user.save();
  }

  return user;
};

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  submitUserUpdate,
  approveUserUpdate,
  deleteUser,
}
