/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IGenericResponse } from '../../../interfaces/common'
import { IUser } from '../user/user.interface'
import { User } from '../user/user.model'

const findSuggestedMatches = async (userId: string): Promise<IUser[]> => {
  const user = await User.findById(userId)
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  const query: any = {
    _id: { $ne: userId },
    sex: { $ne: user.sex },
  }

  if (user?.preferences) {
    if (user?.preferences.looks !== undefined)
      query['user?.preferences?.looks'] = user?.preferences.looks
    if (user?.preferences.religion !== undefined)
      query['user?.preferences?.religion'] = user?.preferences.religion
    if (user?.preferences.joinFamilyLiving !== undefined)
      query['user?.preferences?.joinFamilyLiving'] =
        user?.preferences.joinFamilyLiving
    if (user?.preferences.education !== undefined)
      query['user?.preferences?.education'] = user?.preferences.education
    if (user?.preferences.wantChildren !== undefined)
      query['user?.preferences?.wantChildren'] = user?.preferences.wantChildren
  }

  if (user?.currentJob !== undefined) query.currentJob = user.currentJob
  if (user?.comfortableLongDistance !== undefined)
    query.comfortableLongDistance = user.comfortableLongDistance
  if (user?.partnerGeneratingIncom !== undefined)
    query.partnerGeneratingIncom = user.partnerGeneratingIncom
  if (user?.socialHabits !== undefined) query.socialHabits = user.socialHabits
  if (user?.partnersFamilyBackground !== undefined)
    query.partnersFamilyBackground = user.partnersFamilyBackground
  if (user?.partnerAgeCompare !== undefined)
    query.partnerAgeCompare = user.partnerAgeCompare
  if (user?.reloacte !== undefined) query.reloacte = user.reloacte
  if (user?.supportPartnerWithElderlyParents !== undefined)
    query.supportPartnerWithElderlyParents =
      user.supportPartnerWithElderlyParents
  if (user?.investLongTermRelationship !== undefined)
    query.investLongTermRelationship = user.investLongTermRelationship

  const suggestedMatches = await User.find(query)
  return suggestedMatches
}

const getUserDetails = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId).exec()
}

const getSuggestedUsers = async (user: IUser): Promise<IGenericResponse<IUser[]>> => {
  const query: any = {}

  if (user?.preferences?.ageRange) {
    query.age = user?.preferences.ageRange
  }

  if (user?.education) {
    query.education = user?.education
  }

  if (user?.preferences?.wantChildren !== undefined) {
    query.haveChildren = user?.preferences?.wantChildren
  }

  if (user?.preferences?.religion !== undefined) {
    query['user?.preferences.religion'] = user?.preferences?.religion
  }

  if (user?.preferences?.looks !== undefined) {
    query['user?.preferences.looks'] = { $gte: user?.preferences.looks }
  }

  if (user?.preferences?.joinFamilyLiving !== undefined) {
    query['user?.preferences.joinFamilyLiving'] = user?.preferences.joinFamilyLiving
  }
  const matchesUser = await User.find(query).exec()
  console.log(matchesUser);
  const total = await User.countDocuments(matchesUser)
  // console.log(total);
  return {
    meta: {
      page:0,
      limit:0,
      total,
    },
    data: matchesUser,
  }
}

export const MatchMakingService = {
  findSuggestedMatches,
  getSuggestedUsers,
  getUserDetails,
}
