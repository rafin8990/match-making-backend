import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { paginationFields } from '../../constants/pagination'
// import { IMessageFilter, MessageFilterableFields } from './replyMessage.constant'
// import { IMessage } from './replyMessage.interface'
import { IReplyMessageFilter, ReplyMessageFilterableFields } from './replyMessage.constant'
import { IReplyMessage } from './replyMessage.interface'
import { ReplyMessageService } from './replyMessage.service'

const createReplyMessage = catchAsync(async (req: Request, res: Response) => {
  const Message = req.body
  // console.log(Message)
  const result = await ReplyMessageService.createReplyMessage(Message)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Message Sent successfully',
    success: true,
    data: result,
  })
})

const getAllReplyMessage = catchAsync(async (req: Request, res: Response) => {
  const filters: IReplyMessageFilter = {
    ...pick(req.query, ReplyMessageFilterableFields),
    searchTerm: req.query.searchTerm as string,
  }
  const paginationOptions = pick(req.query, paginationFields)

  const result = await ReplyMessageService.getAllReplyMessage(filters, paginationOptions)

  sendResponse<IReplyMessage[]>(res, {
    statusCode: httpStatus.OK,
    message: 'Message retrieved successfully',
    success: true,
    meta: result.meta,
    data: result.data,
  })
})

const getSingleReplyMessage = catchAsync(async (req: Request, res: Response) => {
  const messsageId = req.params.id
  const result = await ReplyMessageService.getSingleReplyMessage(messsageId)

  sendResponse<IReplyMessage>(res, {
    statusCode: httpStatus.OK,
    message: 'Messsage retrieved successfully',
    success: true,
    data: result,
  })
})

const updateReplyMessage = catchAsync(async (req: Request, res: Response) => {
  const MessageId = req.params.id
  const updateData = req.body
  // console.log(updateData)
  const result = await ReplyMessageService.updateReplyMessage(MessageId, updateData)

  sendResponse<IReplyMessage>(res, {
    statusCode: httpStatus.OK,
    message: 'Message updated successfully',
    success: true,
    data: result,
  })
})

const deleteReplyMessage = catchAsync(async (req: Request, res: Response) => {
  const MessageId = req.params.id
  const result = await ReplyMessageService.deleteReplyMessage(MessageId)

  sendResponse<IReplyMessage>(res, {
    statusCode: httpStatus.OK,
    message: 'Message deleted successfully',
    success: true,
    data: result,
  })
})

export const ReplyMessageController = {
  createReplyMessage,
  getAllReplyMessage,
  getSingleReplyMessage,
  updateReplyMessage,
  deleteReplyMessage,
}
