const mongoose = require("mongoose");

const clutchSchema = new mongoose.Schema({
  couple: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Couple",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  clutchNumber: { type: String, required: true },
  method: { type: String },
  incubationStartDate: { type: Date },
  // eggs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Egg" }],
  //   fertilityVerificationDate: { type: Date },
  //   hatchingDate: { type: Date },
  //   bandingStartDate: { type: Date },
});

const Clutch = mongoose.model("Clutch", clutchSchema);

module.exports = Clutch;
