import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { paginationFields } from '../../constants/pagination'
import { ITemplateFilter, TemplateFilterableFields } from './template.constant'
import { ITemplate } from './template.interface'
import { TemplateService } from './template.service'

const createTemplate = catchAsync(async (req: Request, res: Response) => {
  const template = req.body.templateData
  const result = await TemplateService.createTemplate(template)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Template created successfully',
    success: true,
    data: result,
  })
})

const getAllTemplates = catchAsync(async (req: Request, res: Response) => {
  const filters: ITemplateFilter = {
    ...pick(req.query, TemplateFilterableFields),
    searchTerm: req.query.searchTerm as string,
  }
  const paginationOptions = pick(req.query, paginationFields)
  const result = await TemplateService.getAllTemplates(
    filters,
    paginationOptions
  )
  

  sendResponse<ITemplate[]>(res, {
    statusCode: httpStatus.OK,
    message: 'Templates retrieved successfully',
    success: true,
    meta: result.meta,
    data: result.data,
  })
})

const getSingleTemplate = catchAsync(async (req: Request, res: Response) => {
  const templateId = req.params.id
  const result = await TemplateService.getSingleTemplate(templateId)

  sendResponse<ITemplate>(res, {
    statusCode: httpStatus.OK,
    message: 'Template retrieved successfully',
    success: true,
    data: result,
  })
})

const updateTemplate = catchAsync(async (req: Request, res: Response) => {
  const templateId = req.params.id
  const updateData = req.body
  const result = await TemplateService.updateTemplate(templateId, updateData)

  sendResponse<ITemplate>(res, {
    statusCode: httpStatus.OK,
    message: 'Template updated successfully',
    success: true,
    data: result,
  })
})

const deleteTemplate = catchAsync(async (req: Request, res: Response) => {
  const templateId = req.params.id
  const result = await TemplateService.deleteTemplate(templateId)

  sendResponse<ITemplate>(res, {
    statusCode: httpStatus.OK,
    message: 'Template deleted successfully',
    success: true,
    data: result,
  })
})

export const TemplateController = {
  createTemplate,
  getAllTemplates,
  getSingleTemplate,
  updateTemplate,
  deleteTemplate,
}
