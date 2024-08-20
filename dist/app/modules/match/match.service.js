"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchMakingService = void 0;
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
// import { IUserMatch } from './match.interface'
const match_model_1 = require("./match.model");
const getAllMatchs = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield match_model_1.Match.find();
    return result;
});
const getAllMatchesWithUserDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all matches
        const matches = yield match_model_1.Match.find();
        if (!matches || matches.length === 0) {
            console.log('No matches found');
            return null;
        }
        // Initialize an array to store detailed match results
        const detailedMatches = [];
        // Iterate through each match to fetch user details
        for (const match of matches) {
            const user = yield user_model_1.User.findById(match.userId);
            const matchedUser = yield user_model_1.User.findById(match.matchesUserId);
            // Combine match data with user details
            const detailedMatch = {
                match,
                userDetails: user || null,
                matchedUserDetails: matchedUser || null,
            };
            detailedMatches.push(detailedMatch);
        }
        // console.log('Detailed matches with user info:', detailedMatches);
        return detailedMatches;
    }
    catch (error) {
        console.error('Error fetching matches with user details:', error);
        throw error;
    }
});
const getUserDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.User.findById(userId).exec();
});
const getSuggestedUsers = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const preferences = user.preferences;
    const primaryMatches = [];
    const secondaryMatches = [];
    const users = yield user_model_1.User.find({}).exec();
    users.forEach((potentialMatch) => {
        var _a, _b, _c, _d;
        let primaryScore = 0;
        let secondaryScore = 0;
        if (preferences.looks && potentialMatch.preferences.looks) {
            primaryScore +=
                preferences.looks === potentialMatch.preferences.looks
                    ? 6 - preferences.looks
                    : 0;
        }
        if (preferences.religion && potentialMatch.preferences.religion) {
            primaryScore +=
                preferences.religion === potentialMatch.preferences.religion
                    ? 6 - preferences.religion
                    : 0;
        }
        if (preferences.joinFamilyLiving &&
            potentialMatch.preferences.joinFamilyLiving) {
            primaryScore +=
                preferences.joinFamilyLiving ===
                    potentialMatch.preferences.joinFamilyLiving
                    ? 6 - preferences.joinFamilyLiving
                    : 0;
        }
        if (preferences.education && potentialMatch.preferences.education) {
            primaryScore +=
                preferences.education === potentialMatch.preferences.education
                    ? 6 - preferences.education
                    : 0;
        }
        if (preferences.ageRange && potentialMatch.partnerAgeCompare) {
            const [minAge, maxAge] = preferences.ageRange;
            primaryScore +=
                potentialMatch.partnerAgeCompare.minAge >= minAge &&
                    potentialMatch.partnerAgeCompare.maxAge <= maxAge
                    ? 6 - 5
                    : 0;
        }
        if (preferences.wantChildren !== undefined &&
            potentialMatch.haveChildren !== undefined) {
            primaryScore +=
                preferences.wantChildren === (potentialMatch.haveChildren ? 1 : 0)
                    ? 6 - preferences.wantChildren
                    : 0;
        }
        if (user.education && potentialMatch.education) {
            secondaryScore += user.education === potentialMatch.education ? 1 : 0;
        }
        if (user.firstName && potentialMatch.firstName) {
            secondaryScore += user.firstName === potentialMatch.firstName ? 1 : 0;
        }
        if (user.lastName && potentialMatch.lastName) {
            secondaryScore += user.lastName === potentialMatch.lastName ? 1 : 0;
        }
        if (user.dateOfBirth && potentialMatch.dateOfBirth) {
            secondaryScore += user.dateOfBirth === potentialMatch.dateOfBirth ? 1 : 0;
        }
        if (user.age && potentialMatch.age) {
            secondaryScore += user.age === potentialMatch.age ? 1 : 0;
        }
        if (((_a = user.address) === null || _a === void 0 ? void 0 : _a.city) && ((_b = potentialMatch.address) === null || _b === void 0 ? void 0 : _b.city)) {
            secondaryScore +=
                user.address.city === potentialMatch.address.city ? 1 : 0;
        }
        if (((_c = user.address) === null || _c === void 0 ? void 0 : _c.country) && ((_d = potentialMatch.address) === null || _d === void 0 ? void 0 : _d.country)) {
            secondaryScore +=
                user.address.country === potentialMatch.address.country ? 1 : 0;
        }
        if (user.sex && potentialMatch.sex) {
            secondaryScore += user.sex === potentialMatch.sex ? 1 : 0;
        }
        if (user.birthPlace && potentialMatch.birthPlace) {
            secondaryScore += user.birthPlace === potentialMatch.birthPlace ? 1 : 0;
        }
        if (user.profession && potentialMatch.profession) {
            secondaryScore += user.profession === potentialMatch.profession ? 1 : 0;
        }
        if (user.currentJob && potentialMatch.currentJob) {
            secondaryScore += user.currentJob === potentialMatch.currentJob ? 1 : 0;
        }
        if (user.language && potentialMatch.language) {
            secondaryScore += user.language === potentialMatch.language ? 1 : 0;
        }
        if (user.hobbies && potentialMatch.hobbies) {
            secondaryScore += user.hobbies === potentialMatch.hobbies ? 1 : 0;
        }
        if (user.comfortableLongDistance &&
            potentialMatch.comfortableLongDistance) {
            secondaryScore +=
                user.comfortableLongDistance === potentialMatch.comfortableLongDistance
                    ? 1
                    : 0;
        }
        if (user.partnerGeneratingIncom && potentialMatch.partnerGeneratingIncom) {
            secondaryScore +=
                user.partnerGeneratingIncom === potentialMatch.partnerGeneratingIncom
                    ? 1
                    : 0;
        }
        if (user.socialHabits && potentialMatch.socialHabits) {
            secondaryScore +=
                user.socialHabits === potentialMatch.socialHabits ? 1 : 0;
        }
        if (user.partnersFamilyBackground &&
            potentialMatch.partnersFamilyBackground) {
            secondaryScore +=
                user.partnersFamilyBackground ===
                    potentialMatch.partnersFamilyBackground
                    ? 1
                    : 0;
        }
        if (user.partnerAgeCompare && potentialMatch.partnerAgeCompare) {
            secondaryScore +=
                user.partnerAgeCompare === potentialMatch.partnerAgeCompare ? 1 : 0;
        }
        if (user.relocate && potentialMatch.relocate) {
            secondaryScore += user.relocate === potentialMatch.reloacte ? 1 : 0;
        }
        if (user.supportPartnerWithElderlyParents &&
            potentialMatch.supportPartnerWithElderlyParents) {
            secondaryScore +=
                user.supportPartnerWithElderlyParents ===
                    potentialMatch.supportPartnerWithElderlyParents
                    ? 1
                    : 0;
        }
        if (user.investLongTermRelationship &&
            potentialMatch.investLongTermRelationship) {
            secondaryScore +=
                user.investLongTermRelationship ===
                    potentialMatch.investLongTermRelationship
                    ? 1
                    : 0;
        }
        if (user.countriesVisited && potentialMatch.countriesVisited) {
            secondaryScore +=
                user.countriesVisited === potentialMatch.countriesVisited ? 1 : 0;
        }
        if (user.immigratedYear && potentialMatch.immigratedYear) {
            secondaryScore +=
                user.immigratedYear === potentialMatch.immigratedYear ? 1 : 0;
        }
        if (primaryScore > 0) {
            primaryMatches.push(potentialMatch);
        }
        else if (secondaryScore > 0) {
            secondaryMatches.push(potentialMatch);
        }
    });
    const sortedUsers = [...primaryMatches, ...secondaryMatches];
    return {
        meta: {
            page: 0,
            limit: 0,
            total: sortedUsers.length,
        },
        data: sortedUsers,
    };
});
const createMatch = (userId, suggestedUserId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find users by IDs
        const user = yield user_model_1.User.findById(userId);
        const suggestedUser = yield user_model_1.User.findById(suggestedUserId);
        // Check if both users exist
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        if (!suggestedUser) {
            throw new Error(`Suggested user with ID ${suggestedUserId} not found`);
        }
        // Define the URL for the match request
        // const url = 'https://matchmaking-platform.netlify.app/invitation'
        const url = 'http://localhost:5173/invitation';
        // Send email notifications
        yield Promise.all([
            (0, user_constant_1.sendEmail)(user.email, 'New Match Request', `You have a new match request. View details at: ${url}/${suggestedUserId}`),
            (0, user_constant_1.sendEmail)(suggestedUser.email, 'New Match Request', `You have a new match request. View details at: ${url}/${userId}`),
        ]);
        // Create the match record
        const data = {
            userId,
            userAction: 'no',
            matchesUserId: suggestedUserId,
            matchesAction: 'no',
            action: 'pending',
        };
        const result = yield match_model_1.Match.create(data);
        // Return the created match record
        return result;
    }
    catch (error) {
        // Log and rethrow errors for further handling
        console.error('Error creating match:', error);
        throw error;
    }
});
const resendMatch = (userId, suggestedUserId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find users by IDs
        const user = yield user_model_1.User.findById(userId);
        const suggestedUser = yield user_model_1.User.findById(suggestedUserId);
        // console.log('id', user)
        // Check if both users exist
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        if (!suggestedUser) {
            throw new Error(`Suggested user with ID ${suggestedUserId} not found`);
        }
        // Define the URL for the match request
        // const url = 'https://matchmaking-platform.netlify.app/invitation'
        const url = 'http://localhost:5173/invitation';
        // Send email notifications
        yield Promise.all([
            (0, user_constant_1.sendEmail)(user.email, 'Again Match Request', `You have a again match request. View details at: ${url}/${suggestedUserId}`),
            (0, user_constant_1.sendEmail)(suggestedUser.email, 'Again Match Request', `You have a again match request. View details at: ${url}/${userId}`),
        ]);
        // Create the match record
        // Return the created match record
        return;
    }
    catch (error) {
        // Log and rethrow errors for further handling
        console.error('Error creating match:', error);
        throw error;
    }
});
const UpdateMatch = (userId, suggestedUserId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find users by IDs
        const user = yield match_model_1.Match.findOne({ userId });
        const suggestedUser = yield match_model_1.Match.findOne({
            matchesUserId: suggestedUserId,
        });
        // console.log('user and sug', user, suggestedUser);
        // Prepare the data to be updated
        let updateCriteria = {};
        let updateData = {};
        if (user) {
            console.log('Updating user action');
            updateCriteria = { userId };
            updateData = { userAction: 'yes' };
        }
        else if (suggestedUser) {
            console.log('Updating suggested user action');
            updateCriteria = { matchesUserId: suggestedUserId };
            updateData = { matchesAction: 'yes' };
        }
        else {
            throw new Error('No matching record found for the provided IDs');
        }
        // Perform the initial update operation
        const result = yield match_model_1.Match.findOneAndUpdate(updateCriteria, { $set: updateData }, { new: true } // Return the updated document
        );
        // console.log('Initial update', result);
        if (result) {
            // Check if both actions are set to 'yes'
            if (result.userAction === 'yes' && result.matchesAction === 'yes') {
                // Update to set action as 'accepted'
                const finalUpdateData = { action: 'accepted' };
                const finalResult = yield match_model_1.Match.findOneAndUpdate(updateCriteria, { $set: finalUpdateData }, { new: true } // Return the updated document
                );
                // console.log('Final update', finalResult);
                // Return the final updated match record
                return finalResult;
            }
        }
        // Return the result of the initial update if no final update is needed
        return result || undefined;
    }
    catch (error) {
        // Log and rethrow errors for further handling
        console.error('Error updating match:', error);
        throw error;
    }
});
const UpdateUnmatch = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the match by ID
        const matchDetail = yield match_model_1.Match.findById(id).exec();
        // Check if the match was found
        if (!matchDetail) {
            throw new Error('No matching record found for the provided ID');
        }
        // Prepare the update data
        const updateData = {
            userAction: 'no',
            matchesAction: 'no',
            action: 'pending',
        };
        // Perform the update operation
        const result = yield match_model_1.Match.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true } // Return the updated document and apply schema validators
        ).exec();
        // Log the result for debugging
        console.log('Updated match:', result);
        // Return the updated document or undefined if not found
        return result || undefined;
    }
    catch (error) {
        // Log the error and rethrow it
        console.error('Error updating match:', error);
        throw error;
    }
});
const handleAccept = (userId, matchUserId, action) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    const matchUser = yield user_model_1.User.findById(matchUserId);
    if (!user || !matchUser)
        throw new Error('User not found');
    user === null || user === void 0 ? void 0 : user.matches.push(matchUserId);
    yield user.save();
    yield matchUser.save();
    const data = {
        userId,
        matchUserId,
        action,
    };
    const result = yield match_model_1.Match.create(data);
    return result;
});
exports.MatchMakingService = {
    getAllMatchs,
    getAllMatchesWithUserDetails,
    UpdateMatch,
    getSuggestedUsers,
    getUserDetails,
    createMatch,
    resendMatch,
    handleAccept,
    UpdateUnmatch,
};
