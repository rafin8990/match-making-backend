import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { paginationFields } from "../../constants/pagination";
import { IQuestionFilter, QuestionFilterableFields } from "./question.constant";
import { IQuestion } from "./question.interface";
import { QuestionService } from "./question.service";

const createQuestion = catchAsync(async (req: Request, res: Response) => {
  const question = req.body;
  const result = await QuestionService.createQuestion(question);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Question created successfully",
    success: true,
    data: result,
  });
});

const getAllQuestions = catchAsync(async (req: Request, res: Response) => {
  const filters: IQuestionFilter = {
    ...pick(req.query, QuestionFilterableFields),
    searchTerm: req.query.searchTerm as string,
  };
  const paginationOptions = pick(req.query, paginationFields);

  const result = await QuestionService.getAllQuestions(filters, paginationOptions);

  sendResponse<IQuestion[]>(res, {
    statusCode: httpStatus.OK,
    message: "Questions retrieved successfully",
    success: true,
    meta: result.meta,
    data: result.data,
  });
});

const getSingleQuestion = catchAsync(async (req: Request, res: Response) => {
  const questionId = req.params.id;
  const result = await QuestionService.getSingleQuestion(questionId);

  sendResponse<IQuestion>(res, {
    statusCode: httpStatus.OK,
    message: "Question retrieved successfully",
    success: true,
    data: result,
  });
});

const updateQuestion = catchAsync(async (req: Request, res: Response) => {
  const questionId = req.params.id;
  const updateData = req.body;
  const result = await QuestionService.updateQuestion(questionId, updateData);

  sendResponse<IQuestion>(res, {
    statusCode: httpStatus.OK,
    message: "Question updated successfully",
    success: true,
    data: result,
  });
});

const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
  const questionId = req.params.id;
  const result = await QuestionService.deleteQuestion(questionId);

  sendResponse<IQuestion>(res, {
    statusCode: httpStatus.OK,
    message: "Question deleted successfully",
    success: true,
    data: result,
  });
});

export const QuestionController = {
  createQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};
