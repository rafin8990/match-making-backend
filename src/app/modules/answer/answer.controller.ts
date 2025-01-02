import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { paginationFields } from "../../constants/pagination";
import { AnswerFilterableFields, IAnswerFilter } from "./answer.constant";
import { IAnswer } from "./answer.interface";
import { AnswerService } from "./answer.service";


const createAnswer = catchAsync(async (req: Request, res: Response) => {
    const note = req.body;
    const result = await AnswerService.createAnswer(note);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Answer created successfully",
      success: true,
      data: result,
    });
  });
  
  const getAllAnswer = catchAsync(async (req: Request, res: Response) => {
    const filters: IAnswerFilter = {
      ...pick(req.query, AnswerFilterableFields),
      searchTerm: req.query.searchTerm as string,
    };
    const paginationOptions = pick(req.query, paginationFields);
  
    const result = await AnswerService.getAllAnswer(filters, paginationOptions);
  
    sendResponse<IAnswer[]>(res, {
      statusCode: httpStatus.OK,
      message: "Answer retrieved successfully",
      success: true,
      meta: result.meta,
      data: result.data,
    });
  });
  
  const getSingleAnswer = catchAsync(async (req: Request, res: Response) => {
    const answerId = req.params.id;
    const result = await AnswerService.getSingleAnswer(answerId);
  
    sendResponse<IAnswer>(res, {
      statusCode: httpStatus.OK,
      message: "Answer retrieved successfully",
      success: true,
      data: result,
    });
  });
  
  const updateAnswer = catchAsync(async (req: Request, res: Response) => {
    const answerId = req.params.id;
    const updateData = req.body;
    const result = await AnswerService.updateAnswer(answerId, updateData);
  
    sendResponse<IAnswer>(res, {
      statusCode: httpStatus.OK,
      message: "Answer updated successfully",
      success: true,
      data: result,
    });
  });
  
  const deleteAnswer = catchAsync(async (req: Request, res: Response) => {
    const answerId = req.params.id;
    const result = await AnswerService.deleteAnswer(answerId);
  
    sendResponse<IAnswer>(res, {
      statusCode: httpStatus.OK,
      message: "Answer deleted successfully",
      success: true,
      data: result,
    });
  });

  export const AnswerController={
    createAnswer,
    getAllAnswer,
    getSingleAnswer,
    updateAnswer,
    deleteAnswer
  }