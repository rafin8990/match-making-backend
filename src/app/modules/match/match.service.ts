import { IGenericResponse } from '../../../interfaces/common'
import { IUser } from '../user/user.interface'
import { User } from '../user/user.model'

const getUserDetails = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId).exec()
}

const getSuggestedUsers = async (user: IUser): Promise<IGenericResponse<IUser[]>> => {
  const query: any[] = [];


  if (user?.education) {
    query.push({ education: user.education });
  }
  if (user?.name) {
    query.push({ name: user.name });
  }
  if (user?.dateOfBirth) {
    query.push({ dateOfBirth: user.dateOfBirth });
  }
  if (user?.age) {
    query.push({ age: user.age });
  }
  if (user?.address?.city) {
    query.push({ city: user?.address?.city });
  }
  if (user?.address?.country) {
    query.push({ country: user?.address?.country });
  }
  if (user?.sex) {
    query.push({ sex: user.sex });
  }
  if (user?.birthPlace) {
    query.push({ birthPlace: user.birthPlace });
  }
  if (user?.profession) {
    query.push({ profession: user.profession });
  }
  if (user?.currentJob) {
    query.push({ currentJob: user.currentJob });
  }
  if (user?.language) {
    query.push({ language: user.language });
  }
  if (user?.hobbies) {
    query.push({ hobbies: user.hobbies });
  }
  if (user?.comfortableLongDistance) {
    query.push({ comfortableLongDistance: user.comfortableLongDistance });
  }
  if (user?.partnerGeneratingIncom) {
    query.push({ partnerGeneratingIncom: user.partnerGeneratingIncom });
  }
  if (user?.socialHabits) {
    query.push({ socialHabits: user.socialHabits });
  }
  if (user?.partnersFamilyBackground) {
    query.push({ partnersFamilyBackground: user.partnersFamilyBackground });
  }
  if (user?.partnerAgeCompare) {
    query.push({ partnerAgeCompare: user.partnerAgeCompare });
  }
  if (user?.reloacte) {
    query.push({ reloacte: user.reloacte });
  }
  if (user?.supportPartnerWithElderlyParents) {
    query.push({ supportPartnerWithElderlyParents: user.supportPartnerWithElderlyParents });
  }
  if (user?.investLongTermRelationship) {
    query.push({ investLongTermRelationship: user.investLongTermRelationship });
  }
  if (user?.countriesVisited) {
    query.push({ countriesVisited: user.countriesVisited });
  }
  if (user?.immigratedYear) {
    query.push({ immigratedYear: user.immigratedYear });
  }
 
  console.log(query)
  const matchesUser = await User.find({ $or: query }).exec();
  const total = await User.countDocuments(matchesUser);

  return {
    meta: {
      page: 0,
      limit: 0,
      total,
    },
    data: matchesUser,
  };
};

export const MatchMakingService = {
  getSuggestedUsers,
  getUserDetails,
}
