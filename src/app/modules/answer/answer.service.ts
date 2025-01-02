import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helper/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { AnswerSearchableFields, IAnswerFilter } from "./answer.constant";
import { IAnswer } from "./answer.interface";
import { Answer } from "./answer.model";


const createAnswer = async (answer: IAnswer): Promise<IAnswer> => {
    const result = await Answer.create(answer);
    return result;
  };

  const getAllAnswer = async (
    filters: IAnswerFilter,
    paginationOptions: IPaginationOptions
  ): Promise<IGenericResponse<IAnswer[]>> => {
    try {
      const { searchTerm, ...filtersData } = filters;
      const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(paginationOptions);
  
      const andConditions = [];
      if (searchTerm) {
        andConditions.push({
          $or: AnswerSearchableFields.map(field => ({
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
      const questions = await Answer.find(whereConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
  
      const total = await Answer.countDocuments(whereConditions);
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
        "Unable to retrieve Answer"
      );
    }
  };
  
  const getSingleAnswer = async (id: string): Promise<IAnswer | null> => {
    try {
      const answer = await Answer.findById(id);
      if (!answer) {
        throw new ApiError(httpStatus.NOT_FOUND, "answer not found");
      }
      return answer;
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Unable to retrieve answer"
      );
    }
  };
  
  const updateAnswer = async (
    id: string,
    updateData: Partial<IAnswer>
  ): Promise<IAnswer | null> => {
    try {
      const answer = await Answer.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
  
      if (!answer) {
        throw new ApiError(httpStatus.NOT_FOUND, "answer not found");
      }
      return answer;
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Unable to update answer"
      );
    }
  };
  
  const deleteAnswer = async (id: string): Promise<IAnswer | null> => {
    try {
      const answer = await Answer.findByIdAndDelete(id);
      if (!answer) {
        throw new ApiError(httpStatus.NOT_FOUND, "answer not found");
      }
      return answer;
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Unable to delete answer"
      );
    }
  };

  export const AnswerService={
    createAnswer,
    getAllAnswer,
    getSingleAnswer,
    updateAnswer,
    deleteAnswer
  }