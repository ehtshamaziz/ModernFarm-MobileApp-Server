const mongoose =require("mongoose");

var incomeSchema=new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    category:{type:String},
    amount:{type:Number},
    description:{type:String},

})
const Income = mongoose.model("Income", incomeSchema);
module.exports = Income;
