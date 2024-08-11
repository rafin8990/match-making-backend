import { Request, Response } from 'express'
import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from '../user/user.interface'
import { MatchMakingService } from './match.service'

const getUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id
  const result = await MatchMakingService.getUserDetails(userId)
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    message: 'User retrieved successfully',
    success: true,
    data: result,
  })
})

const getSuggestions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id
  const user = await MatchMakingService.getUserDetails(userId)
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid User ID')
  }
  const suggestedUsers = await MatchMakingService.getSuggestedUsers(user)
  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    message: 'Suggested Users retrieved successfully',
    success: true,
    meta: suggestedUsers.meta,
    data: suggestedUsers.data,
  })
})

const createMatch = catchAsync(async (req: Request, res: Response) => {
  const { userId, suggestedUserId } = req.body
  const result = await MatchMakingService.createMatch(
    userId,
    suggestedUserId,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Match request sent successfully',
    success: true,
    data: result,
  })
})

const handleAccept= catchAsync(async (req: Request, res: Response) => {
  const { userId, matchUserId, action } = req.body
  const result = await MatchMakingService.handleAccept(
    userId,
    matchUserId,
    action
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Match response '${action}' recorded successfully`,
    success: true,
    data: result,
  })
})
export const MatchMakingController = {
  getUser,
  getSuggestions,
  createMatch,
  handleAccept,
}
