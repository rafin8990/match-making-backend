import { Request, Response } from 'express'
import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from '../user/user.interface'
import { IUserMatch } from './match.interface'
import { MatchMakingService } from './match.service'

const getAllMatchs = catchAsync(async (req: Request, res: Response) => {
  try {
    // Retrieve all matches
    const result : any = await MatchMakingService.getAllMatchs();

    // Send response
    sendResponse<IUserMatch>(res, {
      statusCode: httpStatus.OK,
      message: 'Users match retrieved successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    // Handle unexpected errors
    console.error('Error retrieving matches:', error);
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'An error occurred while retrieving matches',
      success: false,
      data: null,
    });
  }
});
const getAllMatchesWithUserDetails = catchAsync(async (req: Request, res: Response) => {
  try {
    // Retrieve all matches
    const result : any = await MatchMakingService.getAllMatchesWithUserDetails();

    // Send response
    sendResponse<IUserMatch>(res, {
      statusCode: httpStatus.OK,
      message: 'Users match retrieved successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    // Handle unexpected errors
    console.error('Error retrieving matches:', error);
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'An error occurred while retrieving matches',
      success: false,
      data: null,
    });
  }
});

 


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
  // console.log('userId', userId, suggestedUserId)
  const result = await MatchMakingService.createMatch(userId, suggestedUserId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Match request sent successfully',
    success: true,
    data: result,
  })
})
const resendMatch = catchAsync(async (req: Request, res: Response) => {
  const { userId, suggestedUserId } = req.body
  // console.log('userId', userId, suggestedUserId)
  const result = await MatchMakingService.resendMatch(userId, suggestedUserId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Match request sent successfully',
    success: true,
    data: result,
  })
})
const UpdateMatch = catchAsync(async (req: Request, res: Response) => {
  const { userId, suggestedUserId } = req.body
  // console.log('userId', userId, suggestedUserId)
  const result = await MatchMakingService.UpdateMatch(userId, suggestedUserId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Match request sent successfully',
    success: true,
    data: result,
  })
})
const UpdateUnmatch = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body
  // console.log('userId', id)
  const result = await MatchMakingService.UpdateUnmatch(id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Unmatch request sent successfully',
    success: true,
    data: result,
  })
})

const handleAccept = catchAsync(async (req: Request, res: Response) => {
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
  getAllMatchs,
  getAllMatchesWithUserDetails,
  UpdateMatch,
  getUser,
  getSuggestions,
  createMatch,
  resendMatch,
  handleAccept,
  UpdateUnmatch,
}
