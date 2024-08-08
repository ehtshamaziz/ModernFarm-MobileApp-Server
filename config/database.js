const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const url=`mongodb+srv://Humza1011:Humza118056@cluster1.bgb1fvt.mongodb.net/modernFarm`

    await mongoose.connect(url);
    console.log("Connected to MongoDB...");
  } catch (err) {
    console.error("Could not connect to MongoDB...", err);
  }
};

module.exports = connectDB;
