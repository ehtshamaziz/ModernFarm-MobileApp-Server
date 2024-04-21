const mongoose =require("mongoose");

var expenseSchema=new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    category:{type:String},
    amount:{type:Number},
    date:{ type: Date},
    description:{type:String},

})
const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
