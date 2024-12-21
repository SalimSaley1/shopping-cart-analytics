import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const dbURI = process.env.DB_URI || '';
    if (!dbURI) {
      throw new Error('DB_URI is not defined in .env');
    }

    await mongoose.connect(dbURI)
     
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
