const mongoose=require('mongoose');

const birdSchema=new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    imageURL: { type: String },
    farmName:{type:String ,required:true},
    farmType:{type:String ,required:true},
    birdName:{type:String },
    birdSpecie:{type:String ,required:true},
    birdRace:{type:String },
    gender:{type:String ,required:true},
    cageNumber:{type:Number ,required:true},
    ringNumber:{type:Number },
    birthDate:{type:String },
    exactBirthDate:{type:Date },
    status:{type:String },
    motherOfBird:{type:String },
    fatherOfBird:{type:String },
    birdOwner:{type:String ,required:true},
    source:{type:String ,required:true},
    price:{type:Number },
   
});

const Bird = mongoose.model("Bird",birdSchema);
module.exports = Bird;