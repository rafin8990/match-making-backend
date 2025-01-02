import httpStatus from 'http-status'
import { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiError'
import { paginationHelpers } from '../../../helper/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { User } from '../user/user.model'
import {
  INotificationFilter,
  notificationSearchableFields,
} from './notification.constant'
import { INotification } from './notification.interface'
import { Notification } from './notification.model'

const createNotification = async (
  notificationData: INotification
): Promise<INotification> => {
  const count = await Notification.countDocuments();
  if (count >= 20) {
    await Notification.find()
      .sort({ createdAt: 1 }) 
      .limit(count - 19)
      .then((oldNotifications) => {
        const idsToDelete = oldNotifications.map((notif) => notif._id);
        return Notification.deleteMany({ _id: { $in: idsToDelete } });
      });
  }
  const result = await Notification.create(notificationData)
  return result
}
const createInviteNotification = async (
  notificationData: INotification
): Promise<INotification> => {
  const count = await Notification.countDocuments();
  if (count >= 20) {
    await Notification.find()
      .sort({ createdAt: 1 }) 
      .limit(count - 19)
      .then((oldNotifications) => {
        const idsToDelete = oldNotifications.map((notif) => notif._id);
        return Notification.deleteMany({ _id: { $in: idsToDelete } });
      });
  }
  const result = await Notification.create(notificationData)
  return result
}

const getAllNotification = async (
  filters: INotificationFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<INotification[]>> => {
  try {
    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];
    if (searchTerm) {
      andConditions.push({
        $or: notificationSearchableFields.map(field => ({
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

    const sortConditions: { [key: string]: SortOrder } = {};
    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    }

    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const notifications = await Notification.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const userIds = [...new Set(notifications.map(notification => notification.userId))]; // Extract unique userIds
    const users = await User.find({ _id: { $in: userIds } }).lean(); // Fetch user details
    const userMap = new Map(users.map(user => [user._id.toString(), user])); // Create a map of user details

    // Merge user details into notifications
    const notificationsWithUserDetails = notifications.map(notification => ({
      ...notification.toObject(),
      user: userMap.get(notification.userId.toString()) || null, // Add user details to each notification
    }));

    const total = await Notification.countDocuments(whereConditions);
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: notificationsWithUserDetails,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Unable to retrieve notifications`
    );
  }
};

const getSingleNotification = async (
  id: string
): Promise<INotification | null> => {
  try {
    const notification = await Notification.findById(id)
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'notification not found')
    }
    return notification
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to retrieve notification'
    )
  }
}

const updateNotification = async (
  id: string,
  updateData: Partial<INotification>
): Promise<INotification | null> => {
  try {
    const notification = await Notification.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    return notification
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to update notification'
    )
  }
}

const deleteNotification = async (
  id: string
): Promise<INotification | null> => {
  try {
    const notification = await Notification.findByIdAndDelete(id)
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, 'notification not found')
    }
    return notification
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to delete notification'
    )
  }
}

export const NotificationService = {
  createNotification,
  createInviteNotification,
  getAllNotification,
  getSingleNotification,
  updateNotification,
  deleteNotification,
}
