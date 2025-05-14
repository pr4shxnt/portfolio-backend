const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return Promise.resolve();
  }

  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 1,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000
    };

    await mongoose.connect(process.env.MONGO_URL, options);
    isConnected = true;
    console.log('Database connected successfully');
    return Promise.resolve();
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    isConnected = false;
    return Promise.reject(error);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
});

// Clean up connection on process termination
process.on('SIGINT', async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    process.exit(0);
  }
});

module.exports = connectDB;