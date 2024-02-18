const mongoose = require("mongoose");

const eggSchema = new mongoose.Schema({
  clutch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clutch",
    required: true,
  },
  parentCouple:{type: mongoose.Schema.Types.ObjectId,
  ref:"Couple",
  required: true,
  
  },
  lastTransferID:{type: mongoose.Schema.Types.ObjectId,
  ref:"Couple",
  },
  birdID:{type: mongoose.Schema.Types.ObjectId,
  ref:"Bird",
  },
  eggNumber: { type: String, required: true },
  eggsLaidDate: { type: Date },
  status: { type: String },
  bird: { type: mongoose.Schema.Types.ObjectId, ref: "Bird" },
  //   earlyStageFeedingDate: { type: Date },
});

const Egg = mongoose.model("Egg", eggSchema);

module.exports = Egg;
