/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericResponse } from '../../../interfaces/common'
import { sendEmail } from '../user/user.constant'
import { IUser } from '../user/user.interface'
import { User } from '../user/user.model'
// import { IUserMatch } from './match.interface'
import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { io } from '../../../server'
import { Notification } from '../notification/notification.model'
import { sendMatchRequest } from './match.constant'
import { Match } from './match.model'

const getAllMatchs = async (): Promise<IUserMatch[] | null> => {
  const result = await Match.find()
  return result
}

// const getAllMatchesWithUserDetails = async (): Promise<any[] | null> => {
//   try {
//     // Fetch all matches
//     const matches = await Match.find()

//     if (!matches || matches.length === 0) {
//       console.log('No matches found')
//       return null
//     }

//     // Initialize an array to store detailed match results
//     const detailedMatches: any[] = []

//     // Iterate through each match to fetch user details
//     for (const match of matches) {
//       const user = await User.findById(match.userId)
//       const matchedUser = await User.findById(match.matchesUserId)

//       // Combine match data with user details
//       const detailedMatch = {
//         match,
//         userDetails: user || null,
//         matchedUserDetails: matchedUser || null,
//       }

//       detailedMatches.push(detailedMatch)
//     }

//     // console.log('Detailed matches with user info:', detailedMatches);

//     return detailedMatches
//   } catch (error) {
//     console.error('Error fetching matches with user details:', error)
//     throw error
//   }
// }
const getAllMatchesWithUserDetails = async (): Promise<any[] | null> => {
  try {
    // Fetch all matches sorted by creation date in descending order
    const matches = await Match.find().sort({ createdAt: -1 }) // or updatedAt: -1

    if (!matches || matches.length === 0) {
      console.log('No matches found')
      return null
    }

    // Initialize an array to store detailed match results
    const detailedMatches: any[] = []

    // Iterate through each match to fetch user details
    for (const match of matches) {
      const user = await User.findById(match.userId)
      const matchedUser = await User.findById(match.matchesUserId)

      // Combine match data with user details
      const detailedMatch = {
        match,
        userDetails: user || null,
        matchedUserDetails: matchedUser || null,
      }

      detailedMatches.push(detailedMatch)
    }

    // console.log('Detailed matches with user info:', detailedMatches);

    return detailedMatches
  } catch (error) {
    console.error('Error fetching matches with user details:', error)
    throw error
  }
}
const getUserDetails = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId).exec()
}

const getSuggestedUsers = async (
  user: IUser
): Promise<IGenericResponse<IUser[]>> => {
  const oppositeGender = user?.sex?.toLowerCase() === 'male' ? 'female' : 'male';
  const preferences: any = user.preferences
  const primaryMatches: IUser[] = []

  const sortedPreferences = Object.entries(preferences)
    .filter(([key, value]) => key !== 'ageRange' && value !== undefined)
    .sort(([, valueA], [, valueB]) => (valueB as number) - (valueA as number))

  const topTwoPreferences = sortedPreferences.slice(0, 2).map(([key]) => key)

  const users = await User.find({
    _id: { $ne: user._id },
    sex: oppositeGender,
  }).exec()

  users.forEach((potentialMatch: any) => {
    let primaryScore = 0


    topTwoPreferences.forEach((preferenceKey: string) => {
      if (
        preferences[preferenceKey] &&
        potentialMatch.preferences[preferenceKey]
      ) {
        primaryScore +=
          preferences[preferenceKey] ===
            potentialMatch.preferences[preferenceKey]
            ? 6 - preferences[preferenceKey]
            : 0
      }
    })

    if (preferences.ageRange && potentialMatch.partnerAgeCompare) {
      const [minAge, maxAge] = preferences.ageRange
      primaryScore +=
        potentialMatch.partnerAgeCompare.minAge >= minAge &&
          potentialMatch.partnerAgeCompare.maxAge <= maxAge
          ? 6 - 5
          : 0
    }

    if (primaryScore > 0) {
      primaryMatches.push(potentialMatch)
    }
  })

  const sortedUsers = [...primaryMatches]

  return {
    meta: {
      page: 0,
      limit: 0,
      total: sortedUsers.length,
    },
    data: sortedUsers,
  }
}

const createMatch = async (
  userId: string,
  suggestedUserId: string
): Promise<IUserMatch | undefined> => {
  try {
    const user = await User.findById(userId)
    const suggestedUser = await User.findById(suggestedUserId)

    if (!user) {
      throw new Error(`User with ID ${userId} not found`)
    }
    if (!suggestedUser) {
      throw new Error(`Suggested user with ID ${suggestedUserId} not found`)
    }

    const phoneNumber = suggestedUser.phoneNumber || '';
    const selectedImage = suggestedUser.selectedImage || '';
    const userNumber = user.phoneNumber || '';
    const userImage = user.selectedImage || '';
    sendMatchRequest(
      user.email,
      "New Match Request",
      suggestedUserId,
      suggestedUser.firstName,
      suggestedUser.lastName,
      suggestedUser.email,
      phoneNumber,
      selectedImage
    );
    sendMatchRequest(
      suggestedUser.email,
      "New Match Request",
      userId,
      user.firstName,
      user.lastName,
      user.email,
      userNumber,
      userImage
    );
   

    const matchData = {
      userId,
      userAction: 'no',
      matchesUserId: suggestedUserId,
      matchesAction: 'no',
      action: 'pending',
    }
    const result = await Match.create(matchData)

    // Return the created match record
    return result
  } catch (error) {
    // Log and rethrow errors for further handling
    console.error('Error creating match:', error)
    throw error
  }
}

const resendMatch = async (
  userId: string,
  suggestedUserId: string
): Promise<IUserMatch | undefined> => {
  try {
    // Find users by IDs
    const user = await User.findById(userId)
    const suggestedUser = await User.findById(suggestedUserId)
    // console.log('data', user)
    // Check if both users exist
    if (!user) {
      throw new Error(`User with ID ${userId} not found`)
    }
    if (!suggestedUser) {
      throw new Error(`Suggested user with ID ${suggestedUserId} not found`)
    }

    // Define the URL for the match request
    const url = 'https://pamojafm.world/invitation'

    // Create email content
    const userEmailContent = `
      <p>You have another match request. View details at: <a href="${url}/${suggestedUserId}">${url}/${suggestedUserId}</a></p>
      <p><strong>Name:</strong> ${suggestedUser.firstName} ${suggestedUser.lastName}</p>
      <p><strong>Email:</strong> ${suggestedUser.email}</p>
      <p><strong>Number:</strong> ${suggestedUser.phoneNumber}</p>
      <p><strong>Height:</strong> ${suggestedUser.height}</p>
      <p><strong>Age:</strong> ${suggestedUser.age}</p>
    `

    const suggestedUserEmailContent = `
      <p>You have another match request. View details at: <a href="${url}/${userId}">${url}/${userId}</a></p>
      <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Number:</strong> ${user.phoneNumber}</p>
      <p><strong>Height:</strong> ${user.height}</p>
      <p><strong>Age:</strong> ${user.age}</p>
    `

    // Send email notifications
    await Promise.all([
      sendEmail(user.email, 'Again Match Request', userEmailContent),
      sendEmail(
        suggestedUser.email,
        'Again Match Request',
        suggestedUserEmailContent
      ),
    ])

    // const notificationData = {
    //   userId: userId,
    //   type: 'request',
    //   message: 'Send a again match request',
    //   section: 'match',
    //   priority: 'medium',
    //   relatedEntityId: 'link',
    //   status: 'unread',
    // }
    // await Notification.create(notificationData)
    return
  } catch (error) {
    console.error('Error resending match request:', error)
    throw error
  }
}

type IUserMatch = {
  userId: string
  matchesUserId: string
  userAction?: string
  matchesAction?: string
  action?: string
}

const UpdateMatch = async (
  userId: string,
  suggestedUserId: string
): Promise<IUserMatch | undefined> => {
  try {
    const user = await Match.findOne({ userId })
    const suggestedUser = await Match.findOne({
      matchesUserId: userId,
    })
    let updateCriteria: any = {}
    let updateData: Partial<IUserMatch> = {}
    let updateId = ''

    if (user) {
      updateCriteria = { userId }
      updateData = { userAction: 'yes' }
      updateId = userId
    } else if (suggestedUser) {
      updateCriteria = { matchesUserId: userId }
      updateData = { matchesAction: 'yes' }
      updateId = suggestedUserId
    } else {
      throw new Error('No matching record found for the provided IDs')
    }

    const result = await Match.findOneAndUpdate(
      updateCriteria,
      { $set: updateData },
      { new: true }
    )

    const userInfo: any = await User.findById(userId)
    const suggestedInfo: any = await User.findById(suggestedUserId)

    const userFullName = `${userInfo.lastName} ${userInfo.firstName}`
    const matchUserFullName = `${suggestedInfo.lastName} ${suggestedInfo.firstName}`

    if (!userInfo) {
      throw new Error('User information not found')
    }

    // Define the URL for the match request
    const url = 'https://pamojafm.world/invitation'
    const acceptRequestion = `
      <p>Accept your match request. View details at: <a href="${url}/${updateId}">${url}/${updateId}</a></p>
      <p><strong>Name:</strong> ${userInfo.firstName} ${userInfo.lastName}</p>
      <p><strong>Email:</strong> ${userInfo.email}</p>
      <p><strong>Number:</strong> ${userInfo.phoneNumber}</p>
      <p><strong>Height:</strong> ${userInfo.height}</p>
      <p><strong>Age:</strong> ${userInfo.age}</p>
    `
    if (result) {
      if (updateId === userId) {
        await sendEmail(
          suggestedInfo.email,
          'Accept Match Request',
          acceptRequestion
        )
      } else if (updateId === suggestedUserId) {
        await sendEmail(
          userInfo.email,
          'Accept Match Request',
          acceptRequestion
        )
      }
    }

    /* 
  userAction?: string
  matchesAction?: string
    */
    // Create notification for the user
    if (result?.userAction === 'yes') {
      const notificationData = {
        message: `<strong>${userFullName}</strong> has accepted the matching invitation.`,
      };
      io.emit('notification', notificationData)
      await Notification.create({
        userId: result._id,
        type: 'request',
        message: notificationData?.message,
        section: 'userMatching Notification',
        priority: 'medium',
        relatedEntityId: result._id,
        status: 'unread',
      })
      // const userNotificationData = {
      //   userId: suggestedInfo.id,
      //   type: 'request',
      //   message: `<strong>${userFullName}</strong> has accepted the matching invitation.`,
      //   section: 'user-matching',
      //   priority: 'medium',
      //   relatedEntityId: 'link',
      //   status: 'unread',
      // }
      // await Notification.create(userNotificationData)
    }

    if (result?.matchesAction === 'yes') {
      const notificationData = {
        message: `<strong>${matchUserFullName}</strong> has accepted the matching invitation.`,
      };
      io.emit('notification', notificationData)
      await Notification.create({
        userId: result._id,
        type: 'request',
        message: notificationData?.message,
        section: 'Match user Notification',
        priority: 'medium',
        relatedEntityId: result._id,
        status: 'unread',
      })
      // const matchUserNotificationData = {
      //   userId: userInfo.id,
      //   type: 'request',
      //   message: `<strong>${matchUserFullName}</strong> has accepted the matching invitation.`,
      //   section: 'user-matching',
      //   priority: 'medium',
      //   relatedEntityId: 'link',
      //   status: 'unread',
      // }
      // await Notification.create(matchUserNotificationData)
    }

    if (result) {
      if (result.userAction === 'yes' && result.matchesAction === 'yes') {
        const finalUpdateData = { action: 'accepted' }
        const finalResult = await Match.findOneAndUpdate(
          updateCriteria,
          { $set: finalUpdateData },
          { new: true }
        )

        return finalResult as IUserMatch | undefined
      }
    }

    return result || undefined
  } catch (error) {
    console.error('Error updating match:', error)
    throw error
  }
}

const CheckMatch = async (
  userId: string,
  suggestedUserId: string
): Promise<boolean> => {
  try {
    const userMatch = await Match.findOne({
      $or: [
        { userId: userId, matchesUserId: suggestedUserId },
        { userId: suggestedUserId, matchesUserId: userId },
      ],
    })

    if (!userMatch) {
      return false
    }

    if (
      (userMatch.userId === userId && userMatch.userAction === 'yes') ||
      (userMatch.userId === suggestedUserId &&
        userMatch.matchesAction === 'yes')
    ) {
      return true
    }

    // If no conditions are met, return false
    return false
  } catch (error) {
    // Log and rethrow errors for further handling
    console.error('Error checking match:', error)
    throw error
  }
}

const DeleteUnmatch = async (id: string): Promise<IUserMatch | undefined> => {
  try {
    // const matchInfo: any= await Match.findById(id);
    // if (!matchInfo) {
    //   throw new ApiError(httpStatus.NOT_FOUND, 'Match not found');
    // }

    // const userInfo: any = await User.findById(matchInfo.userId)
    // const suggestedInfo: any = await User.findById(matchInfo.suggestedUserId)
    // if (!userInfo || !suggestedInfo) {
    //   throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    // }

    // // Create email content
    // const userEmailContent = `
    //   <p><strong>Name:</strong> ${suggestedInfo.firstName} ${suggestedInfo.lastName}</p>
    //   <p><strong>Email:</strong> ${suggestedInfo.email}</p>
    //   <p><strong>Number:</strong> ${suggestedInfo.phoneNumber}</p>
    //   <p><strong>Height:</strong> ${suggestedInfo.height}</p>
    //   <p><strong>Age:</strong> ${suggestedInfo.age}</p>
    // `

    // const suggestedUserEmailContent = `

    //   <p><strong>Name:</strong> ${userInfo.firstName} ${userInfo.lastName}</p>
    //   <p><strong>Email:</strong> ${userInfo.email}</p>
    //   <p><strong>Number:</strong> ${userInfo.phoneNumber}</p>
    //   <p><strong>Height:</strong> ${userInfo.height}</p>
    //   <p><strong>Age:</strong> ${userInfo.age}</p>
    // `

    // // Send email notifications
    // await Promise.all([
    //   sendEmail(userInfo.email, 'Unmatch Request', userEmailContent),
    //   sendEmail(
    //     suggestedInfo.email,
    //     'Unmatch Request',
    //     suggestedUserEmailContent
    //   ),
    // ])

    const match = await Match.findByIdAndDelete(id)

    if (!match) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Match not found')
    }
    return match
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Unable to delete match'
    )
  }
}

const handleAccept = async (
  userId: string,
  matchUserId: string,
  action: 'pending' | 'accepted' | 'declined'
): Promise<IUserMatch> => {
  const user: any = await User.findById(userId)
  const matchUser = await User.findById(matchUserId)

  if (!user || !matchUser) throw new Error('User not found')
  user?.matches.push(matchUserId)
  await user.save()
  await matchUser.save()
  const data = {
    userId,
    matchUserId,
    action,
  }
  const result = await Match.create(data)

  return result
}

export const MatchMakingService = {
  getAllMatchs,
  getAllMatchesWithUserDetails,
  getSuggestedUsers,
  getUserDetails,
  createMatch,
  resendMatch,
  UpdateMatch,
  CheckMatch,
  handleAccept,
  DeleteUnmatch,
}
