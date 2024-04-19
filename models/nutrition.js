const mongoose =require("mongoose");

const nutritionSchema=new mongoose.Schema({
user:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
farm:{type:mongoose.Schema.Types.ObjectId, ref:"Farm"},
bird:[{type:mongoose.Schema.Types.ObjectId, ref:"Bird"}],
couple:[{type:mongoose.Schema.Types.ObjectId, ref:"Couple"}],
mealType:{type:String},
dosage:{type:String},
mealDescription:{type:String},
quantity:{type:String},
nutritionDate:{ type: Date, default: Date.now},
appliedTo: {type: String,required:true},
timezoneOffset :{type:Number}

})

const Nutrition= mongoose.model("Nutrition",nutritionSchema);
module.exports =Nutrition;