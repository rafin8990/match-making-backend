import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { paginationFields } from "../../constants/pagination";
import { INoteFilter, NoteFilterableFields } from "./note.constant";
import { INote } from "./note.interface";
import { NoteService } from "./note.service";

const createNote = catchAsync(async (req: Request, res: Response) => {
    const note = req.body;
    const result = await NoteService.createNote(note);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "note created successfully",
      success: true,
      data: result,
    });
  });
  
  const getAllNote = catchAsync(async (req: Request, res: Response) => {
    const filters: INoteFilter = {
      ...pick(req.query, NoteFilterableFields),
      searchTerm: req.query.searchTerm as string,
    };
    const paginationOptions = pick(req.query, paginationFields);
  
    const result = await NoteService.getAllNote(filters, paginationOptions);
  
    sendResponse<INote[]>(res, {
      statusCode: httpStatus.OK,
      message: "Note retrieved successfully",
      success: true,
      meta: result.meta,
      data: result.data,
    });
  });
  
  const getSingleNote = catchAsync(async (req: Request, res: Response) => {
    const noteId = req.params.id;
    const result = await NoteService.getSingleNote(noteId);
  
    sendResponse<INote>(res, {
      statusCode: httpStatus.OK,
      message: "note retrieved successfully",
      success: true,
      data: result,
    });
  });
  
  const updateNote = catchAsync(async (req: Request, res: Response) => {
    const noteId = req.params.id;
    const updateData = req.body;
    const result = await NoteService.updateNote(noteId, updateData);
  
    sendResponse<INote>(res, {
      statusCode: httpStatus.OK,
      message: "note updated successfully",
      success: true,
      data: result,
    });
  });
  
  const deleteNote = catchAsync(async (req: Request, res: Response) => {
    const noteId = req.params.id;
    const result = await NoteService.deleteNote(noteId);
  
    sendResponse<INote>(res, {
      statusCode: httpStatus.OK,
      message: "Note deleted successfully",
      success: true,
      data: result,
    });
  });

  export const NoteController={
    createNote,
    getAllNote,
    getSingleNote,
    updateNote,
    deleteNote
  }