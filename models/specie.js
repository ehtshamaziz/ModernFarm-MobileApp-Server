const mongoose = require("mongoose");

const SpecieSchema = new mongoose.Schema({
  specieType: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },
  imageURL: { type: String, required: true },
  sexualMaturity: { type: Number, required: true },
  incubation: { type: Number },
  addRingAfter: { type: Number, required: true },
  leavingNestAfter: { type: Number, required: true },
  startFeedingAfter: { type: Number, required: true },
  fertilityDays: { type: Number, required: true },
  eggInterval: { type: Number, required: true },
  approval: { type: Boolean, default: false },
});

const Specie = mongoose.model("Specie", SpecieSchema);

module.exports = Specie;
