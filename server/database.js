require('dotenv').config();
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: process.env.MONGO_DB_USER,
      pass: process.env.MONGO_DB_PASSWORD,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
};

export default {
  connectDB: connectDB,
  closeDB: closeDB,
};
