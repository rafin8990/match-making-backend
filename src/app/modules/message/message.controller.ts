import { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../../../shared/catchAsync"
import pick from "../../../shared/pick"
import sendResponse from "../../../shared/sendResponse"
import { paginationFields } from "../../constants/pagination"
import { IMessageFilter, MessageFilterableFields } from "./message.constant"
import { IMessage } from "./message.interface"
import { MessageService } from "./message.service"

const createMessage = catchAsync(async (req: Request, res: Response) => {
    const Message = req.body
    const result = await MessageService.createMessage(Message)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Message Sent successfully',
        success: true,
        data: result,
    })
})


const getAllMessage = catchAsync(async (req: Request, res: Response) => {
    const filters: IMessageFilter = {
        ...pick(req.query, MessageFilterableFields),
        searchTerm: req.query.searchTerm as string,
    }
    const paginationOptions = pick(req.query, paginationFields)

    const result = await MessageService.getAllMessage(filters, paginationOptions)

    sendResponse<IMessage[]>(res, {
        statusCode: httpStatus.OK,
        message: 'Message retrieved successfully',
        success: true,
        meta: result.meta,
        data: result.data,
    })
})

const getSingleMessage = catchAsync(async (req: Request, res: Response) => {
    const messsageId = req.params.id
    const result = await MessageService.getSingleMessage(messsageId)

    sendResponse<IMessage>(res, {
        statusCode: httpStatus.OK,
        message: 'Messsage retrieved successfully',
        success: true,
        data: result,
    })
})

const updateMessage = catchAsync(async (req: Request, res: Response) => {
    const MessageId = req.params.id
    const updateData = req.body
    // console.log(updateData)
    const result = await MessageService.updateMessage(MessageId, updateData)

    sendResponse<IMessage>(res, {
        statusCode: httpStatus.OK,
        message: 'Message updated successfully',
        success: true,
        data: result,
    })
})

const deleteMessage = catchAsync(async (req: Request, res: Response) => {
    const MessageId = req.params.id
    const result = await MessageService.deleteMessage(MessageId)

    sendResponse<IMessage>(res, {
        statusCode: httpStatus.OK,
        message: 'Message deleted successfully',
        success: true,
        data: result,
    })
})


export const MessageController = {
    createMessage,
    getAllMessage,
    getSingleMessage,
    updateMessage,
    deleteMessage
}