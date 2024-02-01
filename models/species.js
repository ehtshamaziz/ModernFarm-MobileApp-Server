const mongoose=require("mongoose");

const SpecieSchema = new mongoose.Schema({
     specieType: {
    type: String,
    required: true,
    // enum: ["Nutrition", "Medicines", "Farm Tools & Equipment"],
  },
  name: { type: String, required: true },
  imageURL: { type: String },
  incubation: { type: String },
  sexualMaturity: { type: Number, required: true },
  addRingAfter: { type: Number, required: true },
  leavingNestAfter: { type: Number, required: true },
  startFeedingAfter: { type: Number, required: true },
  fertilityDays: { type: Number, required: true },
  eggInterval: { type: Number, required: true },
  approval:{type:Boolean}
});

const Specie=mongoose.model("Specie",SpecieSchema);

module.exports=Specie;