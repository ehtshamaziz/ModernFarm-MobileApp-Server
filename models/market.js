const mongoose=require("mongoose");

var marketSchema=new mongoose.Schema({
    type:{type:String, required:true},
    imageURL:{type:String,required: true },

    birdRace:{type:String},
    birdAge: { type: Number, required: true },

    size:{type:String},
    madeType:{type:String},
    condition:{type:String},

    description:{type:String},
    sellerName:{type:String},
    gender:{type:String},
    phoneNumber:{type:Number},
    price:{type:Number},
    sellerLocation:{type:String},
    
    itemPostedOn:{type:Date, default:Date.now}

});

const Market=mongoose.model("Market", marketSchema);
module.exports=Market;