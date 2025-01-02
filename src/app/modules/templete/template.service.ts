import httpStatus from 'http-status'
import { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { paginationHelpers } from '../../../helper/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { ITemplateFilter, TemplateSearchableFields } from './template.constant'
import { ITemplate } from './template.interface'
import { Template } from './template.model'

const createTemplate = async (template: ITemplate): Promise<ITemplate> => {
  const result = await Template.create(template)
  return result
}
const getAllTemplates = async (
  filters: ITemplateFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ITemplate[]>> => {
  try {
    const { searchTerm, ...filtersData } = filters;paginationHelpers
    const { page, limit, skip, sortBy } = paginationHelpers.calculatePagination(paginationOptions);

    // Initialize conditions
    const andConditions: any[] = [];
    if (searchTerm) {
      andConditions.push({
        $or: TemplateSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
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

    // Set default sorting to sort by 'createdAt' in descending order
    const sortConditions: { [key: string]: SortOrder } = {};
    if (sortBy) {
      // Allow user-defined sorting (e.g., by 'name' or other fields)
      sortConditions[sortBy] = 'asc';
    }

    // Always sort by 'createdAt' in descending order to show latest data first
    sortConditions['createdAt'] = 'desc';

    // Construct where conditions
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

    // Fetch templates with sorting and pagination
    const templates = await Template.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    // Count total documents
    const total = await Template.countDocuments(whereConditions);

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: templates,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to retrieve templates');
  }
};


const getSingleTemplate = async (id: string): Promise<ITemplate | null> => {
  try {
    const template = await Template.findById(id)
    if (!template) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Template not found')
    }
    return template
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to retrieve template'
    )
  }
}

const updateTemplate = async (
  id: string,
  updateData: Partial<ITemplate>
): Promise<ITemplate | null> => {
  try {
    const template = await Template.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!template) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Template not found')
    }
    return template
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to update template'
    )
  }
}

const deleteTemplate = async (id: string): Promise<ITemplate | null> => {
  try {
    const template = await Template.findByIdAndDelete(id)
    if (!template) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Template not found')
    }
    return template
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to delete template'
    )
  }
}

export const TemplateService = {
  createTemplate,
  getAllTemplates,
  getSingleTemplate,
  updateTemplate,
  deleteTemplate,
}
