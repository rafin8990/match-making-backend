import bcrypt from 'bcrypt'
import { Schema, model } from 'mongoose'
import { IUser, IUserMethod, userModel } from './user.interface'

const userSchema = new Schema<IUser, Record<string, never>, IUserMethod>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
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
      type: String,
    },
    sex: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    height: {
      type: String,
    },
    dateOfBirth: {
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
      type: String,
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
      type: Schema.Types.Mixed,
    },
    updateStatusMessage: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

userSchema.methods.isUserExist = async function (
  email: string
): Promise<Partial<IUser | null>> {
  const user = await User.findOne(
    { email },
    {
      email: 1,
      password: 1,
      role: 1,
      needsPasswordChange: 1,
      isVerified: 1,
    }
  )
  return user
}

userSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  const isMatched = await bcrypt.compare(givenPassword, savedPassword)
  return isMatched
}

// userSchema.pre('save', async function (next) {
//   this.password = await bcrypt.hash(
//     this.password,
//     Number(config.bycrypt_sault_round),
//   );
//   next();
// });

export const User = model<IUser, userModel>('User', userSchema)
