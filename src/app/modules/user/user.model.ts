import { Schema, model } from 'mongoose';
import { IUser, IUserMethod, userModel } from './user.interface';

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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.methods.isUserExist = async function (
  email: string,
): Promise<Partial<IUser | null>> {
  const user = await User.findOne(
    { email },
    {
      email: 1,
      password: 1,
      role: 1,
      needsPasswordChange: 1,
      isVerified: 1,
    },
  );
  return user;
};

// userSchema.methods.isPasswordMatched = async function (
//   givenPassword: string,
//   savedPassword: string,
// ): Promise<boolean> {
//   const isMatched = await bcrypt.compare(givenPassword, savedPassword);
//   return isMatched;
// };

// userSchema.pre('save', async function (next) {
//   this.password = await bcrypt.hash(
//     this.password,
//     Number(config.bycrypt_sault_round),
//   );
//   next();
// });

export const User = model<IUser, userModel>('User', userSchema);
