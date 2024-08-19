import httpStatus from 'http-status'
import { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { paginationHelpers } from '../../../helper/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { sendEmail } from '../user/user.constant'
import { IMessageFilter, MessageSearchableFields } from './message.constant'
import { IMessage } from './message.interface'
import { Message } from './message.model'

const createMessage = async (messageData: IMessage): Promise<IMessage> => {
  const message = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    ${messageData.content}
</body>
</html>`
  await sendEmail(
    messageData.email,
    'You received an message from Admin',
    message
  )
  const result = await Message.create(messageData)
  return result
}

const getAllMessage = async (
  filters: IMessageFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IMessage[]>> => {
  try {
    const { searchTerm, ...filtersData } = filters
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(paginationOptions)
    const andConditions = []
    if (searchTerm) {
      andConditions.push({
        $or: MessageSearchableFields.map(field => ({
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
    const messages = await Message.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit)

    const total = await Message.countDocuments(whereConditions)
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: messages,
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Unable to retrieve users`
    )
  }
}

const getSingleMessage = async (id: string): Promise<IMessage | null> => {
  try {
    const message = await Message.findById(id)
    if (!message) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Message not found')
    }
    return message
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to retrieve message'
    )
  }
}

const updateMessage = async (
  id: string,
  updateData: Partial<IMessage>
): Promise<IMessage | null> => {
  try {
    const message = await Message.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!message) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    return message
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to update message'
    )
  }
}

const deleteMessage = async (id: string): Promise<IMessage | null> => {
  try {
    const message = await Message.findByIdAndDelete(id)
    if (!message) {
      throw new ApiError(httpStatus.NOT_FOUND, 'message not found')
    }
    return message
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to delete message'
    )
  }
}

export const MessageService = {
  createMessage,
  getAllMessage,
  getSingleMessage,
  updateMessage,
  deleteMessage,
}
