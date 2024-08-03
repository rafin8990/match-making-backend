import { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MatchMakingService } from "./match.service";

const findSuggestedMatches  = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    if (!Types.ObjectId.isValid(userId)) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid User ID');
    const result = await MatchMakingService.findSuggestedMatches(userId)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'User created successfully',
      success: true,
      data: result,
    })
  })


  export const MatchMakingController={
    findSuggestedMatches
  }