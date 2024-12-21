import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
}
type UserModel = Model<IUser>
const userSchema: Schema<IUser, UserModel> = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
);


const User = mongoose.model<IUser, UserModel>('User', userSchema);
export default User;
