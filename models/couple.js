const mongoose = require("mongoose");

const coupleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
  coupleId: { type: String, required: true, unique: true },
  femaleBird: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bird",
    required: true,
  },
  maleBird: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bird",
    required: true,
  },
  formationDate: { type: Date },
  cageNumber: { type: String },
  status: { type: String },
  is_archived:{type:Boolean,default: false},
  specie:{ type: mongoose.Schema.Types.ObjectId, ref: "Specie", required: true },
  descendants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bird",
    },
  ],
  dateAdded: { type: Date, default: Date.now },
  inMarket:{type:Boolean,default:false},
  isSold:{type:Boolean},
  soldOn: {type:Date},


});

const Couple = mongoose.model("Couple", coupleSchema);

module.exports = Couple;
