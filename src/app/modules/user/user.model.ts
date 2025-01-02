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
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isFirstTime: {
      type: Boolean,
      default: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
    },
    lastName: {
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
      zip: {
        type: Number,
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
    },
    height: {
      heightfeet: { type: Number, default: null },
      heightinch: { type: Number, default: null },
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
      type: String,
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
    maritual_status: {
      type: String,
    },
    comfortableLongDistance: {
      type: String,
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
    relocate: {
      type: String,
    },
    supportPartnerWithElderlyParents: {
      type: String,
    },
    investLongTermRelationship: {
      type: String,
    },
    countriesVisited: {
      type: String,
    },
    immigratedYear: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    pendingImages: {
      type: [String],
      default: [],
    },
    selectedImage: {
      type: String,
    },
    verificationCode: {
      type: Number,
    },
    pendingUpdates: {
      type: Schema.Types.Mixed,
      default: [],
    },
    referredBy:{
      type: String,
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
    matches: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    otpCode: { type: Number },
    otpExpiration: { type: Date },
    questions: {
      type: [Object],
    },
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

userSchema.methods.addImage = async function (imageUrl: string): Promise<void> {
  if (this.images.length >= 5) {
    this.images.shift()
  }
  this.images.push(imageUrl)
  this.selectedImage = imageUrl
  await this.save()
}

// userSchema.pre('save', async function (next) {
//   this.password = await bcrypt.hash(
//     this.password,
//     Number(config.bycrypt_sault_round),
//   );
//   next();
// });

export const User = model<IUser, userModel>('User', userSchema)
