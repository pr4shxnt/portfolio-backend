const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = async () => {
  try {
    dotenv.config();
    const conn = await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log(`MongoDB Connected, server live in http://localhost:${process.env.PORT}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;