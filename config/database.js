const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbURL = 'mongodb+srv://Humza1011:Humza118056@cluster1.bgb1fvt.mongodb.net/modernFarm?retryWrites=true&w=majority';
    await mongoose.connect(dbURL);
    console.log("Connected to MongoDB...");
  } catch (err) {
    console.error("Could not connect to MongoDB...", err);
  }
};

module.exports = connectDB;
