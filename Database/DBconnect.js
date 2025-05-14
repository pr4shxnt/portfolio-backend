const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
   

    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    isConnected = false;
    throw error;
  }
};


module.exports = connectDB;