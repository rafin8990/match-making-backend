import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helper/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IQuestionFilter, QuestionSearchableFields } from "./question.constant";
import { IQuestion } from "./question.interface";
import { Question } from "./question.model";

const createQuestion = async (question: IQuestion): Promise<IQuestion> => {
  const result = await Question.create(question);
  return result;
};

const getAllQuestions = async (
  filters: IQuestionFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IQuestion[]>> => {
  try {
    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];
    if (searchTerm) {
      andConditions.push({
        $or: QuestionSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }

    if (Object.keys(filtersData).length) {
      andConditions.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    }
    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};
    const questions = await Question.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const total = await Question.countDocuments(whereConditions);
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: questions,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Unable to retrieve questions"
    );
  }
};

const getSingleQuestion = async (id: string): Promise<IQuestion | null> => {
  try {
    const question = await Question.findById(id);
    if (!question) {
      throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
    }
    return question;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Unable to retrieve question"
    );
  }
};

const updateQuestion = async (
  id: string,
  updateData: Partial<IQuestion>
): Promise<IQuestion | null> => {
  try {
    const question = await Question.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
    }
    return question;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Unable to update question"
    );
  }
};

const deleteQuestion = async (id: string): Promise<IQuestion | null> => {
  try {
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
    }
    return question;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Unable to delete question"
    );
  }
};

export const QuestionService = {
  createQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};
