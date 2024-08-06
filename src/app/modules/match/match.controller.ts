import { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IUser } from "../user/user.interface";
import { MatchMakingService } from "./match.service";

const findSuggestedMatches  = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    if (!Types.ObjectId.isValid(userId)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid User ID');
    const result = await MatchMakingService.findSuggestedMatches(userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'user matches successfully',
      success: true,
      data: result,
    })
  })


  const getUser  = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id
    const result = await MatchMakingService.getUserDetails(userId);
  
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      message: 'User retrieved successfully',
      success: true,
      data: result,
    })
  })

const getSuggestions   = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const user = await MatchMakingService.getUserDetails(userId);
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid User ID');
    }
    const suggestedUsers = await MatchMakingService.getSuggestedUsers(user);
    sendResponse<IUser[]>(res, {
      statusCode: httpStatus.OK,
      message: 'Suggested Users retrieved successfully',
      success: true,
      meta: suggestedUsers.meta,
      data: suggestedUsers.data,
    })
   
  })


  export const MatchMakingController={
    findSuggestedMatches,
    getUser,
    getSuggestions
  }