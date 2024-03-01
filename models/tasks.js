const mongoose=require("mongoose");

const TaskSchema= new mongoose.Schema({
    eggId:{type:mongoose.Schema.Types.ObjectId, ref:"Egg"},
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    farm:{type:mongoose.Schema.Types.ObjectId,ref:"Farm"},
    fertilityDate:{type:Date},
    hatchingDate:{type:Date},
    birdRecordDate:{type:Date},
    earlyFeedingDate:{type:Date},
    eggLaidDate:{type:Date},
    clutchNumber:{type:String},
    coupleId:{type: String},
    cageNumber:{type:String},
    action:{type:Boolean, default:false},
});

const Task =mongoose.model( "Task", TaskSchema );
module.exports=Task;