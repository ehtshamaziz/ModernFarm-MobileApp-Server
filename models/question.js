const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({
  question:{ type: String, required: true},

  answer: { type: String, required: true },
  url: { type: String },


  // eggs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Egg" }],
  //   fertilityVerificationDate: { type: Date },
  //   hatchingDate: { type: Date },
  //   bandingStartDate: { type: Date },
});

const Question = mongoose.model("Question", questionsSchema);

module.exports = Question;
