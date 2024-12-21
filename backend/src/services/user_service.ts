import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, {IUser} from '../models/user_model';
import { HydratedDocument } from 'mongoose';

export interface UserSignupData {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  token: string;
}

export class AuthService {
  // Signup method
  async signup(userData: UserSignupData): Promise<void> {
    try {
      // Hash the password
      const hash = await bcrypt.hash(userData.password, 10);

      // Create new user
      const user : HydratedDocument<IUser> = new User({
        email: userData.email,
        password: hash
      });

      // Save the user
      await user.save();
    } catch (error) {
      throw error;
    }
  }

  // Login method
  async login(userData: UserSignupData): Promise<LoginResponse> {
    try {
      const user  = await User.findOne({ email: userData.email });
      if (!user) {
        throw new Error('Incorrect login/password');
      }
      const valid = await bcrypt.compare(userData.password, user.password);
      if (!valid) {
        throw new Error('Incorrect login/password');
      }
      const userId = user._id.toString();
      const token = jwt.sign(
        { id: userId, email: user.email },
        process.env.JWT_SECRET || "RANDOM_TOKEN_SECRET",
        { expiresIn: "1h" }
      );
      return {
        userId,
        token
      };
    } catch (error) {

      throw error;
    }
  }
}
