import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import { SortOrder } from 'mongoose'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import { paginationHelpers } from '../../../helper/paginationHelper'
import { IGenericResponse } from '../../../interfaces/common'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { io } from '../../../server'
import { Notification } from '../notification/notification.model'
import {
  generateRandomPassword,
  IUserFilter,
  sendEmail,
  UserSearchableFields,
} from './user.constant'
import { IUser } from './user.interface'
import { User } from './user.model'

const createUser = async (user: IUser): Promise<IUser> => {
  console.log(user)
  const existingUser = await User.findOne({ email: user.email });

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email Already exists');
  }

 
  const password2 = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(
    password2,
    Number(config.bycrypt_sault_round)
  );

  user.password = hashedPassword;
  user.isVerified = false;
  user.isApproved = false;
  user.role = 'user';
  user.images = user.images || []; 

  if (user.selectedImage && !user.images.includes(user.selectedImage)) {
    user.images.push(user.selectedImage);
  }
  if (user.images.length > 5) {
    user.images = user.images.slice(-5);
  }
  const result = await User.create(user);
  const notificationData = {
    message: `New Registration request from <b>${user?.email}</b>`,
  };

  io.emit('notification', notificationData);

  await Notification.create({
    userId: result._id,
    type: 'request',
    message: notificationData?.message,
    section: 'user-registration',
    priority: 'medium',
    relatedEntityId: result._id,
    status: 'unread',
  });

  setImmediate(async () => {
    try {
      await sendEmail(
        user.email,
        'PamojaFM',
        `Welcome to PamojaFM! Your account has been created successfully. Here are your login credentials: <br/>
        Email: ${user.email} <br/>
        Password: ${password2} <br/>
        Please log in and update your password as soon as possible.`
      );


      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await sendEmail(
          admin.email,
          'New User Registration Request',
          `A new registration request has been received from <b>${user.email}</b>. Please log in to the admin panel to review and approve the request.`
        );
        console.log(`Notification email sent to admin: ${admin.email}.`);
      }
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  });

  return result;
};


const getAllUsers = async (
  filters: IUserFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  try {
    const { searchTerm, ...filtersData } = filters
    const { page, limit, skip } =
      paginationHelpers.calculatePagination(paginationOptions)

    const andConditions = []

    if (searchTerm) {
      andConditions.push({
        $or: UserSearchableFields.map(field => ({
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        })),
      })
    }

    if (Object.keys(filtersData).length) {
      andConditions.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      })
    }

    const sortConditions: { [key: string]: SortOrder } = {
      lastName: 'asc',
    }

    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {}

    const users = await User.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments(whereConditions)

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: users,
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Unable to retrieve users`
    )
  }
}

const getSingleUser = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to retrieve user'
    )
  }
}
const getUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const user = await User.findOne({ email }).lean()
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    return user
  } catch (error) {
    console.error('Error retrieving user:', error)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to retrieve user'
    )
  }
}

const updateUser = async (
  id: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  try {
    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    const admins = await User.find({ role: 'admin' })
    for (const admin of admins) {
      await sendEmail(
        admin.email,
        'Admin Profile changed',
        `An Admin update his Profile. Please <a href="https://pamojafm.world/dashboard/register_request_list"><i>Check Here</i></a> `
      )
    }
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to update user'
    )
  }
}

// const submitUserUpdate = async (
//   id: string,
//   updateData: Partial<IUser>
// ): Promise<IUser | null> => {
//   const user = await User.findById(id)
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
//   }
//   if (updateData.selectedImage) {
//     user.selectedImage = updateData.selectedImage
//     if (user.images && user.images.length >= 5) {
//       user.images.shift()
//     }
//     user.images?.push(updateData.selectedImage)
//   }
//   user.pendingUpdates = { ...user.pendingUpdates, ...updateData }
//   user.isFirstTime = false
//   user.isUpdated = false
//   await user.save()
//   if (user?.isApproved === true) {
//     const notificationData = {
//       userId: id,
//       type: 'request',
//       message: user.isApproved
//         ? `<b>${user?.lastName} ${user?.firstName}</b> has sent a profile update request!`
//         : `<b>${user?.email}</b> has sent a profile update request!`,
//       section: 'match',
//       priority: 'medium',
//       relatedEntityId: 'link',
//       status: 'unread',
//     }
//     await Notification.create(notificationData)
//   }

//   const admins = await User.find({ role: 'admin' })
//   for (const admin of admins) {
//     await sendEmail(
//       admin.email,
//       'New Update Request',
//       `A new update request has been received from <b>${user.email}</b>. Please review the request in the admin panel . <a href="https://pamojafm.world/dashboard/register_request_list"><i>Click Here</i></a>.`
//     )
//   }
//   return user
// }
const submitUserUpdate = async (
  id: string,
  updateData: Partial<IUser>
): Promise<IUser | null> => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Handle selected image logic
  if (updateData.selectedImage) {
    user.selectedImage = updateData.selectedImage;
    if (user.images && user.images.length >= 5) {
      user.images.shift();
    }
    user.images?.push(updateData.selectedImage);
  }

  // Check if the updateData contains only preferences
  if (updateData.preferences) {
    user.preferences = {
      ...user.preferences,
      ...updateData.preferences,
    };
    await user.save();
    return user; // Directly return the user after updating preferences
  }

  // Handle general updates that require admin approval
  user.pendingUpdates = { ...user.pendingUpdates, ...updateData };
  user.isFirstTime = false;
  user.isUpdated = false;
  await user.save();

  // Notify admins only if the user is approved
  if (user?.isApproved === true) {

    const notificationData = {
      message: ` <b>${user?.lastName} ${user?.firstName}</b> has sent a profile update request!`,
    };

    io.emit('notification', notificationData)

    await Notification.create({
      userId: id,
      type: 'request',
      message: notificationData?.message,
      section: 'Update',
      priority: 'medium',
      relatedEntityId: id,
      status: 'unread',
    })
    // const notificationData = {
    //   userId: id,
    //   type: "request",
    //   message: user.isApproved
    //     ? `<b>${user?.lastName} ${user?.firstName}</b> has sent a profile update request!`
    //     : `<b>${user?.email}</b> has sent a profile update request!`,
    //   section: "match",
    //   priority: "medium",
    //   relatedEntityId: "link",
    //   status: "unread",
    // };
    // await Notification.create(notificationData);
  }

  // Send email to all admins
  const admins = await User.find({ role: "admin" });
  for (const admin of admins) {
    await sendEmail(
      admin.email,
      "New Update Request",
      `A new update request has been received from <b>${user.email}</b>. Please review the request in the admin panel. <a href="https://pamojafm.world/dashboard/register_request_list"><i>Click Here</i></a>.`
    );
  }

  return user;
};


const approveUserUpdate = async (id: string): Promise<IUser | null> => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  user.isApproved = true;

  if (user.pendingUpdates) {
    Object.assign(user, user.pendingUpdates);
    user.pendingUpdates = undefined;
    user.isUpdated = true;
    await user.save();
  }

  // Combine existing images with pending images
  user.images = [...(user.images || []), ...(user.pendingImages || [])];
  user.pendingImages = [];

  // Keep only the last 5 images
  if (user.images.length > 5) {
    user.images = user.images.slice(-5); // Retain the last 5 images
  }

  await user.save();

  const admins = await User.find({ role: "admin" });
  for (const admin of admins) {
    await sendEmail(
      admin.email,
      "New Update Request",
      `A new update request has been Confirm. Please <a href="https://pamojafm.world/dashboard/register_request_list"><i>Click Here</i></a> `
    );
  }

  return user;
};

const declineUserUpdate = async (id: string): Promise<IUser | null> => {
  const user = await User.findById(id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  await sendEmail(
    user.email,
    'Request Declined',
    `Your Request To Update the Profile Data has been declined, Please try Again Later`
  )
  user.pendingUpdates = undefined
  user.isUpdated = true
  await user.save()
  return user
}

const deleteUser = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to delete user'
    )
  }
}

const selectedPhoto = async (
  id: string,
  imageURL: string
): Promise<IUser | null> => {
  try {
    // console.log(imageURL)
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    user.selectedImage = imageURL

    await user.save()
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to Select photo'
    )
  }
}
const removeSelectedPhoto = async (id: string): Promise<IUser | null> => {
  try {
    // console.log(imageURL)
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    user.selectedImage = ''

    await user.save()
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to remove Selected photo'
    )
  }
}

const updatePhoto = async (
  id: string,
  imageURL: string
): Promise<IUser | null> => {
  try {
    // console.log(imageURL)
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    user.pendingImages && user.pendingImages.push(imageURL)

    if (user.pendingImages && user.pendingImages.length > 5) {
      user.pendingImages.shift()
    }

    if (user?.isApproved === true) {
      const notificationData = {
        userId: id,
        type: 'request',
        message: user.isApproved
          ? `<b>${user?.lastName} ${user?.firstName}</b> has sent a profile update request!`
          : `<b>${user?.email}</b> has sent a profile update request!`,
        section: 'match',
        priority: 'medium',
        relatedEntityId: 'link',
        status: 'unread',
      }
      await Notification.create(notificationData)
    }



    user.isUpdated = false
    await user.save()
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to update photo'
    )
  }
}
const updateAdminPhoto = async (
  id: string,
  imageURL: string
): Promise<IUser | null> => {
  try {
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
   
  user.images = [...(user.images || []),imageURL];

  if (user.images.length > 5) {
    user.images = user.images.slice(-5); 
  }

    user.isUpdated = false
    await user.save()
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to update photo'
    )
  }
}

const deletePhoto = async (
  id: string,
  imageUrl: string
): Promise<IUser | null> => {
  try {
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    if (user.images && user.images.includes(imageUrl)) {
      user.images = user.images.filter(image => image !== imageUrl)

      if (user.selectedImage === imageUrl) {
        user.selectedImage = undefined
      }
      await user.save()
      return user
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Image not found in user images')
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to delete photo'
    )
  }
}

const toggleTwoFactorAuthentication = async (
  id: string,
  enable: boolean
): Promise<IUser | null> => {
  try {
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    user.is2Authenticate = enable
    await user.save()
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to update two-factor authentication status'
    )
  }
}

const makeAdmin = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    user.role = 'admin'
    await user.save()
    return user
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to Make Admin')
  }
}

const removeAdmin = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(id)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    user.role = 'user'
    await user.save()
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to remove from admin'
    )
  }
}

const makeDisabled = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(id, { isDisabled: 1, email: 1 })
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    user.isDisabled = true
    await user.save()
    await sendEmail(user.email, 'PamojaFM', `Your Account has been disabled.`)
    /* const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await sendEmail(
        admin.email,
        'PamojaFM',
        `${user.email} account disabled successfully `
      );
    } */
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to disabled user'
    )
  }
}
const removeDisabled = async (id: string): Promise<IUser | null> => {
  try {
    const user = await User.findById(id, { isDisabled: 1, email: 1 })
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }
    user.isDisabled = false
    await user.save()
    await sendEmail(user.email, 'PamojaFM', `Your Account enabled succesfully.`)
    /*  const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await sendEmail(
        admin.email,
        'PamojaFM',
        `${user.email} account enabled successfully `
      );
    } */
    return user
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to disabled user'
    )
  }
}

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  getUserByEmail,
  updateUser,
  submitUserUpdate,
  approveUserUpdate,
  declineUserUpdate,
  deleteUser,
  updatePhoto,
  deletePhoto,
  toggleTwoFactorAuthentication,
  removeAdmin,
  makeAdmin,
  makeDisabled,
  removeDisabled,
  selectedPhoto,
  removeSelectedPhoto,
  updateAdminPhoto
}
