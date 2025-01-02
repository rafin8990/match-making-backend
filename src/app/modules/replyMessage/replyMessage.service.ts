import httpStatus from 'http-status'
import { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { paginationHelpers } from '../../../helper/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { Notification } from '../notification/notification.model'
import { sendEmail } from '../user/user.constant'
import {
  IReplyMessageFilter,
  ReplyMessageSearchableFields,
} from './replyMessage.constant'
import { IReplyMessage } from './replyMessage.interface'
import { ReplyMessage } from './replyMessage.model'

const createReplyMessage = async (
  messageData: IReplyMessage
): Promise<IReplyMessage> => {
  // console.log('re', messageData)
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
  await sendEmail(messageData.email, 'You received an reply message', message)

  const notificationData = {
    userId: messageData.userId,
    type: 'request',
    message: `Send a message reply of ${messageData.email}`,
    section: 'match',
    priority: 'medium',
    relatedEntityId: 'link',
    status: 'unread',
  }

  // Create the notification record
  await Notification.create(notificationData)
  const result = await ReplyMessage.create(messageData)
  return result
}

const getAllReplyMessage = async (
  filters: IReplyMessageFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IReplyMessage[]>> => {
  try {
    const { searchTerm, ...filtersData } = filters
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(paginationOptions)
    const andConditions = []
    if (searchTerm) {
      andConditions.push({
        $or: ReplyMessageSearchableFields.map(field => ({
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
    const messages = await ReplyMessage.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit)

    const total = await ReplyMessage.countDocuments(whereConditions)
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

const getSingleReplyMessage = async (
  id: string
): Promise<IReplyMessage | null> => {
  try {
    const message = await ReplyMessage.findById(id)
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

const updateReplyMessage = async (
  id: string,
  updateData: Partial<IReplyMessage>
): Promise<IReplyMessage | null> => {
  try {
    const message = await ReplyMessage.findByIdAndUpdate(id, updateData, {
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

const deleteReplyMessage = async (
  id: string
): Promise<IReplyMessage | null> => {
  try {
    const message = await ReplyMessage.findByIdAndDelete(id)
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

export const ReplyMessageService = {
  createReplyMessage,
  getAllReplyMessage,
  getSingleReplyMessage,
  updateReplyMessage,
  deleteReplyMessage,
}
