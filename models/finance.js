const mongoose =require("mongoose");

var financeSchema=new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    financeCategory:{type:String},
    financeType:{type:String},
    amount:{type:Number},
    date:{ type: Date},
    description:{type:String},

})
const Finance = mongoose.model("Finance", financeSchema);
module.exports = Finance;
