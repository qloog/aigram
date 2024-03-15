import mongoose from 'mongoose';

let isConnected = false; // variable to check if the connection is already established

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL) return console.error('MONGODB_URL not found');
  if (isConnected) return console.error('Already connected to MongoDB');

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true;
    
    console.log(`MongoDB connected: ${db.connection.host}`);
  } catch (error) {
    console.error(error);
  }
}

