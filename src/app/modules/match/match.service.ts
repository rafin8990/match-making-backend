import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import { IUser } from '../user/user.interface'
import { User } from '../user/user.model'

const findSuggestedMatches = async (userId: string): Promise<IUser[]> => {
  const user = await User.findById(userId);
  console.log(user)
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  const suggestedMatches = await User.find({
    _id: { $ne: userId },
    sex: { $ne: user.sex },
    'preferences.looks': user.preferences.looks,
    'preferences.religion': user.preferences.religion,
    'preferences.joinFamilyLiving': user.preferences.joinFamilyLiving,
    'preferences.education': user.preferences.education,
    'preferences.wantChildren': user.preferences.wantChildren,
    comfortableLongDistance: user.comfortableLongDistance,
    partnerGeneratingIncom: user.partnerGeneratingIncom,
    socialHabits: user.socialHabits,
    partnersFamilyBackground: user.partnersFamilyBackground,
    partnerAgeCompare: user.partnerAgeCompare,
    reloacte: user.reloacte,
    supportPartnerWithElderlyParents: user.supportPartnerWithElderlyParents,
    investLongTermRelationship: user.investLongTermRelationship,
  })

  return suggestedMatches
}

export const MatchMakingService = {
  findSuggestedMatches,
}
