import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { paginationFields } from '../../constants/pagination'
import {
  INotificationFilter,
  notificationFilterableFields,
} from './notification.constant'
import { INotification } from './notification.interface'
import { NotificationService } from './notification.service'

const createNotification = catchAsync(async (req: Request, res: Response) => {
  const notification = req.body
  // console.log(Message)
  const result = await NotificationService.createNotification(notification)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Notification Sent successfully',
    success: true,
    data: result,
  })
})
const createInviteNotification = catchAsync(
  async (req: Request, res: Response) => {
    const notification = req.body
    // console.log(Notification)
    const result = await NotificationService.createInviteNotification(
      notification
    )
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Notification Sent successfully',
      success: true,
      data: result,
    })
  }
)

const getAllNotification = catchAsync(async (req: Request, res: Response) => {
  const filters: INotificationFilter = {
    ...pick(req.query, notificationFilterableFields),
    searchTerm: req.query.searchTerm as string,
  }
  const paginationOptions = pick(req.query, paginationFields)

  const result = await NotificationService.getAllNotification(
    filters,
    paginationOptions
  )

  sendResponse<INotification[]>(res, {
    statusCode: httpStatus.OK,
    message: 'Notification retrieved successfully',
    success: true,
    meta: result.meta,
    data: result.data,
  })
})

const getSingleNotification = catchAsync(
  async (req: Request, res: Response) => {
    const notificationId = req.params.id
    const result = await NotificationService.getSingleNotification(
      notificationId
    )

    sendResponse<INotification>(res, {
      statusCode: httpStatus.OK,
      message: 'Notification retrieved successfully',
      success: true,
      data: result,
    })
  }
)

const updateNotification = catchAsync(async (req: Request, res: Response) => {
  const notificationId = req.params.id
  const updateData = req.body
  // console.log(notificationId, updateData)
  const result = await NotificationService.updateNotification(
    notificationId,
    updateData
  )

  sendResponse<INotification>(res, {
    statusCode: httpStatus.OK,
    message: 'Notification updated successfully',
    success: true,
    data: result,
  })
})

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const notificationId = req.params.id
  const result = await NotificationService.deleteNotification(notificationId)

  sendResponse<INotification>(res, {
    statusCode: httpStatus.OK,
    message: 'Notification deleted successfully',
    success: true,
    data: result,
  })
})

export const NotificationController = {
  createNotification,
  createInviteNotification,
  getAllNotification,
  getSingleNotification,
  updateNotification,
  deleteNotification,
}
