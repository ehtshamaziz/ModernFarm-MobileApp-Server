const mongoose = require("mongoose");

const generalSettingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  facebookUrl: { type: String, required: true },
  twitterUrl: { type: String, required: true },
  instagramUrl: { type: String, required: true },
  linkedinUrl: { type: String, required: true },
  youTubeUrl: { type: String, required: true },
  officeAddress: { type: String, required: true },
});

const GeneralSetting = mongoose.model("GeneralSetting", generalSettingSchema);

module.exports = GeneralSetting;
