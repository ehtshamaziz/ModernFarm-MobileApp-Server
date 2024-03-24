const mongoose =require("mongoose");

const nutritionSchema=new mongoose.Schema({
user:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
farm:{type:mongoose.Schema.Types.ObjectId, ref:"Farm"},
bird:[{type:mongoose.Schema.Types.ObjectId, ref:"Bird"}],
couple:[{type:mongoose.Schema.Types.ObjectId, ref:"Couple"}],
mealType:{type:String},
mealDescription:{type:String},
quantity:{type:Number},
nutritionDate:{ type: Date, default: Date.now}

})

const Nutrition= mongoose.model("Nutrition",nutritionSchema);
module.exports =Nutrition;