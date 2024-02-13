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
  specie:{ type: mongoose.Schema.Types.ObjectId, ref: "Specie", required: true },
  descendants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bird",
    },
  ],
  dateAdded: { type: Date, default: Date.now },
});

const Couple = mongoose.model("Couple", coupleSchema);

module.exports = Couple;
