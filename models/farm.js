const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
  farmType: { type: String, required: true },
  farmName: { type: String, required: true },
  country: { type: String, required: true },
  currencyType: { type: String },
  phoneNumber: { type: String },
  location: { type: String,
    // text: { type: String, required: true },
    // link: { type: String },
  },
});

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
