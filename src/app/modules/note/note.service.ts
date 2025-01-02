import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helper/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { INoteFilter, NoteSearchableFields } from "./note.constant";
import { INote } from "./note.interface";
import { Note } from "./note.model";

const createNote = async (note: INote): Promise<INote> => {
  const result = await Note.create(note);
  return result;
};

const getAllNote = async (
  filters: INoteFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<INote[]>> => {
  try {
    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];
    if (searchTerm) {
      andConditions.push({
        $or: NoteSearchableFields.map(field => ({
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
    const questions = await Note.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const total = await Note.countDocuments(whereConditions);
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
      "Unable to retrieve Notes"
    );
  }
};

const getSingleNote = async (id: string): Promise<INote | null> => {
  try {
    const note = await Note.findById(id);
    if (!note) {
      throw new ApiError(httpStatus.NOT_FOUND, "note not found");
    }
    return note;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Unable to retrieve note"
    );
  }
};

const updateNote = async (
  id: string,
  updateData: Partial<INote>
): Promise<INote | null> => {
  try {
    const note = await Note.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!note) {
      throw new ApiError(httpStatus.NOT_FOUND, "Question not found");
    }
    return note;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Unable to update note"
    );
  }
};

const deleteNote = async (id: string): Promise<INote | null> => {
  try {
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      throw new ApiError(httpStatus.NOT_FOUND, "Note not found");
    }
    return note;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Unable to delete note"
    );
  }
};

export const NoteService = {
  createNote,
  getAllNote,
  getSingleNote,
  updateNote,
  deleteNote
}