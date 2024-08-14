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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    passwordChangedAt: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isUpdated: {
        type: Boolean,
        default: false,
    },
    is2Authenticate: {
        type: Boolean,
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
    },
    address: {
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    phoneNumber: {
        type: String,
    },
    age: {
        type: Number,
    },
    sex: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    height: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    birth_country: {
        type: String,
    },
    birthPlace: {
        type: String,
    },
    education: {
        type: String,
        enum: ['college', 'high school', 'other'],
    },
    educationDetails: {
        type: String,
    },
    profession: {
        type: String,
    },
    currentJob: {
        type: String,
    },
    language: {
        type: String,
    },
    jamatkhanaAttendence: {
        type: String,
    },
    haveChildren: {
        type: Boolean,
    },
    personality: {
        type: String,
    },
    sports: {
        type: String,
    },
    hobbies: {
        type: String,
    },
    comfortableLongDistance: {
        type: String,
        enum: ['yes', 'no'],
    },
    partnerGeneratingIncom: {
        type: String,
    },
    socialHabits: {
        type: String,
    },
    partnersFamilyBackground: {
        type: String,
    },
    partnerAgeCompare: {
        minAge: {
            type: Number,
        },
        maxAge: {
            type: Number,
        },
    },
    reloacte: {
        type: String,
        enum: ['yes', 'no'],
    },
    supportPartnerWithElderlyParents: {
        type: String,
        enum: ['yes', 'no'],
    },
    investLongTermRelationship: {
        type: String,
        enum: ['yes', 'no'],
    },
    countriesVisited: {
        type: Number,
    },
    immigratedYear: {
        type: String,
    },
    image: {
        type: String,
    },
    verificationCode: {
        type: Number,
    },
    pendingUpdates: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    updateStatusMessage: {
        type: String,
        default: '',
    },
    preferences: {
        looks: {
            type: Number,
        },
        religion: {
            type: Number,
        },
        joinFamilyLiving: {
            type: Number,
        },
        education: {
            type: Number,
        },
        ageRange: {
            type: [Number],
        },
        wantChildren: {
            type: Number,
        },
    },
    matches: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
userSchema.methods.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield exports.User.findOne({ email }, {
            email: 1,
            password: 1,
            role: 1,
            needsPasswordChange: 1,
            isVerified: 1,
        });
        return user;
    });
};
userSchema.methods.isPasswordMatched = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatched = yield bcrypt_1.default.compare(givenPassword, savedPassword);
        return isMatched;
    });
};
// userSchema.pre('save', async function (next) {
//   this.password = await bcrypt.hash(
//     this.password,
//     Number(config.bycrypt_sault_round),
//   );
//   next();
// });
exports.User = (0, mongoose_1.model)('User', userSchema);
