const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbURL = 'mongodb://127.0.0.1:27017/modernFarm';
    await mongoose.connect(dbURL);
    console.log("Connected to MongoDB...");
  } catch (err) {
    console.error("Could not connect to MongoDB...", err);
  }
};

module.exports = connectDB;
