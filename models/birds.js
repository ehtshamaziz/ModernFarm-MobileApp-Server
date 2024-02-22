const mongoose = require("mongoose");

var birdSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
  imageURL: { type: String, required: true },
  birdId: { type: String, required: true },
  birdName: { type: String, required: true },
  birdSpecie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Specie",
    required: true,
  },
  // eggID:{type :String},
  birdRace: { type: String },
  gender: { type: String, required: true },
  cageNumber: { type: String, required: true },
  ringNumber: { type: String, required: true },
  birthDate: { type: Number },
  exactBirthDate: { type: Date },
  status: { type: String },
  couple:{type:mongoose.Schema.Types.ObjectId,ref:"Couple"},
  is_archived:{type:Boolean,default: false},
  birdOwner: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
  source: { type: String },
  price: { type: Number },
  dateAdded: { type: Date, default: Date.now },
});

const Bird = mongoose.model("Bird", birdSchema);
module.exports = Bird;
