const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({

  user:{type: mongoose.Schema.Types.ObjectId, ref:"User"},
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
  diseaseSelection:{type:mongoose.Schema.Types.ObjectId,ref:"Disease"},
  medicineSelection:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
  bird:[{type:mongoose.Schema.Types.ObjectId,ref:"Bird"}],
  couple:[{type:mongoose.Schema.Types.ObjectId,ref:"Couple"}],

  treatmentName:{type: String, required: true},
  medicineRecipe:{type:String},
  dosage:{type:String},
  treatmentStartDate:{type:Date},
  durationOfTreatment:{type:String},
  treatmentRecurrancePeriod:{type:String},
  appliedTo: {type: String,required:true},
  timezoneOffset :{type:Number}

});

const Treatment = mongoose.model("Treatment", treatmentSchema);

module.exports = Treatment;
