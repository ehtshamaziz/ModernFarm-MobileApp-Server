const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema({

    user:{type: mongoose.Schema.Types.ObjectId, ref:"User"},
    diseaseName:{type:String,required:true},
    symptoms:{type:String},
    causes:{type:String},
    prevention:{type:String},
    treatment:{type:String},
});

const Disease = mongoose.model("Disease", diseaseSchema);

module.exports = Disease;
