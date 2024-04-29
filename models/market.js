const mongoose=require("mongoose");

var marketSchema=new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm"},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specie:{ type: mongoose.Schema.Types.ObjectId, ref: "Specie"},
    bird:{ type: mongoose.Schema.Types.ObjectId, ref: "Bird"},
    couple:{ type: mongoose.Schema.Types.ObjectId, ref: "Couple"},

    marketCategory:{type:String},
    animalType:{type:String},
    description:{type:String},
    imageURL:{type:String,required: true },


    birdRace:{type:String},
    birdAge: { type: Number},

    size:{type:String},
    madeType:{type:String},
    condition:{type:String},

    sellerName:{type:String},
    gender:{type:String},
    phoneNumber:{type:Number},
    price:{type:Number},
    sellerLocation:{type:String},
    
    itemPostedOn:{type:Date, default:Date.now}

});

const Market=mongoose.model("Market", marketSchema);
module.exports=Market;