import { IGenericResponse } from '../../../interfaces/common'
import { sendEmail } from '../user/user.constant'
import { IUser } from '../user/user.interface'
import { User } from '../user/user.model'
import { IUserMatch } from './match.interface'
import { Match } from './match.model'

const getUserDetails = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId).exec()
}

const getSuggestedUsers = async (
  user: IUser
): Promise<IGenericResponse<IUser[]>> => {
  const preferences = user.preferences
  const primaryMatches: IUser[] = []
  const secondaryMatches: IUser[] = []

  const users = await User.find({}).exec()

  users.forEach(potentialMatch => {
    let primaryScore = 0
    let secondaryScore = 0

    if (preferences.looks && potentialMatch.preferences.looks) {
      primaryScore +=
        preferences.looks === potentialMatch.preferences.looks
          ? 6 - preferences.looks
          : 0
    }
    if (preferences.religion && potentialMatch.preferences.religion) {
      primaryScore +=
        preferences.religion === potentialMatch.preferences.religion
          ? 6 - preferences.religion
          : 0
    }
    if (
      preferences.joinFamilyLiving &&
      potentialMatch.preferences.joinFamilyLiving
    ) {
      primaryScore +=
        preferences.joinFamilyLiving ===
        potentialMatch.preferences.joinFamilyLiving
          ? 6 - preferences.joinFamilyLiving
          : 0
    }
    if (preferences.education && potentialMatch.preferences.education) {
      primaryScore +=
        preferences.education === potentialMatch.preferences.education
          ? 6 - preferences.education
          : 0
    }
    if (preferences.ageRange && potentialMatch.partnerAgeCompare) {
      const [minAge, maxAge] = preferences.ageRange
      primaryScore +=
        potentialMatch.partnerAgeCompare.minAge >= minAge &&
        potentialMatch.partnerAgeCompare.maxAge <= maxAge
          ? 6 - 5
          : 0
    }

    if (
      preferences.wantChildren !== undefined &&
      potentialMatch.haveChildren !== undefined
    ) {
      primaryScore +=
        preferences.wantChildren === (potentialMatch.haveChildren ? 1 : 0)
          ? 6 - preferences.wantChildren
          : 0
    }

    if (user.education && potentialMatch.education) {
      secondaryScore += user.education === potentialMatch.education ? 1 : 0
    }
    if (user.name && potentialMatch.name) {
      secondaryScore += user.name === potentialMatch.name ? 1 : 0
    }
    if (user.dateOfBirth && potentialMatch.dateOfBirth) {
      secondaryScore += user.dateOfBirth === potentialMatch.dateOfBirth ? 1 : 0
    }
    if (user.age && potentialMatch.age) {
      secondaryScore += user.age === potentialMatch.age ? 1 : 0
    }
    if (user.address?.city && potentialMatch.address?.city) {
      secondaryScore +=
        user.address.city === potentialMatch.address.city ? 1 : 0
    }
    if (user.address?.country && potentialMatch.address?.country) {
      secondaryScore +=
        user.address.country === potentialMatch.address.country ? 1 : 0
    }
    if (user.sex && potentialMatch.sex) {
      secondaryScore += user.sex === potentialMatch.sex ? 1 : 0
    }
    if (user.birthPlace && potentialMatch.birthPlace) {
      secondaryScore += user.birthPlace === potentialMatch.birthPlace ? 1 : 0
    }
    if (user.profession && potentialMatch.profession) {
      secondaryScore += user.profession === potentialMatch.profession ? 1 : 0
    }
    if (user.currentJob && potentialMatch.currentJob) {
      secondaryScore += user.currentJob === potentialMatch.currentJob ? 1 : 0
    }
    if (user.language && potentialMatch.language) {
      secondaryScore += user.language === potentialMatch.language ? 1 : 0
    }
    if (user.hobbies && potentialMatch.hobbies) {
      secondaryScore += user.hobbies === potentialMatch.hobbies ? 1 : 0
    }
    if (
      user.comfortableLongDistance &&
      potentialMatch.comfortableLongDistance
    ) {
      secondaryScore +=
        user.comfortableLongDistance === potentialMatch.comfortableLongDistance
          ? 1
          : 0
    }
    if (user.partnerGeneratingIncom && potentialMatch.partnerGeneratingIncom) {
      secondaryScore +=
        user.partnerGeneratingIncom === potentialMatch.partnerGeneratingIncom
          ? 1
          : 0
    }
    if (user.socialHabits && potentialMatch.socialHabits) {
      secondaryScore +=
        user.socialHabits === potentialMatch.socialHabits ? 1 : 0
    }
    if (
      user.partnersFamilyBackground &&
      potentialMatch.partnersFamilyBackground
    ) {
      secondaryScore +=
        user.partnersFamilyBackground ===
        potentialMatch.partnersFamilyBackground
          ? 1
          : 0
    }
    if (user.partnerAgeCompare && potentialMatch.partnerAgeCompare) {
      secondaryScore +=
        user.partnerAgeCompare === potentialMatch.partnerAgeCompare ? 1 : 0
    }
    if (user.reloacte && potentialMatch.reloacte) {
      secondaryScore += user.reloacte === potentialMatch.reloacte ? 1 : 0
    }
    if (
      user.supportPartnerWithElderlyParents &&
      potentialMatch.supportPartnerWithElderlyParents
    ) {
      secondaryScore +=
        user.supportPartnerWithElderlyParents ===
        potentialMatch.supportPartnerWithElderlyParents
          ? 1
          : 0
    }
    if (
      user.investLongTermRelationship &&
      potentialMatch.investLongTermRelationship
    ) {
      secondaryScore +=
        user.investLongTermRelationship ===
        potentialMatch.investLongTermRelationship
          ? 1
          : 0
    }
    if (user.countriesVisited && potentialMatch.countriesVisited) {
      secondaryScore +=
        user.countriesVisited === potentialMatch.countriesVisited ? 1 : 0
    }
    if (user.immigratedYear && potentialMatch.immigratedYear) {
      secondaryScore +=
        user.immigratedYear === potentialMatch.immigratedYear ? 1 : 0
    }

    if (primaryScore > 0) {
      primaryMatches.push(potentialMatch)
    } else if (secondaryScore > 0) {
      secondaryMatches.push(potentialMatch)
    }
  })

  const sortedUsers = [...primaryMatches, ...secondaryMatches]

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
  const user = await User.findById(userId)
  const suggestedUser = await User.findById(suggestedUserId)
  if (!user || !suggestedUser) throw new Error('User not found')
  const url = `https://matchmacking-platform.netlify.app`
  await sendEmail(
    `${user.email}`,
    'New Match Request',
    `You have a new match request. View details at: ${url}/${userId} `
  )
  await sendEmail(
    `${suggestedUser.email}`,
    'New Match Request',
    `You have a new match request. View details at: ${url}/${suggestedUserId} `
  )
  const data = {
    userId,
    suggestedUser,
    action: 'pending',
  }
  const result = await Match.create(data)
  return result
}

const handleAccept = async (
  userId: string,
  matchUserId: string,
  action: 'pending' | 'accepted' | 'declined'
): Promise<IUserMatch> => {
  const user = await User.findById(userId)
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
  getSuggestedUsers,
  getUserDetails,
  createMatch,
  handleAccept,
}
