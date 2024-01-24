const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  farmType: { type: String, required: true },
  farmName: { type: String, required: true },
  phoneNumber: { type: String },
  country: {
    countryName: { type: String },
    countryFlag: { type: String },
    callingCode: { type: String },
    currency: { type: String },
  },
  location: {
    text: { type: String },
    link: { type: String },
  },
});

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
