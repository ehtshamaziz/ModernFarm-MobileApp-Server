const mongoose=require("mongoose");

var marketSchema=new mongoose.Schema({
    farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm"},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specie:{ type: mongoose.Schema.Types.ObjectId, ref: "Specie"},
    bird:{ type: mongoose.Schema.Types.ObjectId, ref: "Bird"},
    couple:{ type: mongoose.Schema.Types.ObjectId, ref: "Couple"},
    productsId:{ type: mongoose.Schema.Types.ObjectId, ref: "Product"},
    productCategory:{type:String},
    productType:{type:String},

    marketCategory:{type:String},
    animalType:{type:String},
    description:{type:String},
    imageURL:{type:[String],required: true },
    gender:{type:String},

    price:{type:Number},
    phoneNumber:{type:Number},


    birdRace:{type:String},
    age: { type: Number},

    size:{type:String},
    madeType:{type:String},
    condition:{type:String},

    
    location: {
    text: { type: String },
    link: { type: String },
  },
    
    itemPostedOn:{type:Date}

});

const Market=mongoose.model("Market", marketSchema);
module.exports=Market;