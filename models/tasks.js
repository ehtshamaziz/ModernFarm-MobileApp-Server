const mongoose=require("mongoose");

const TaskSchema= new mongoose.Schema({
    eggId:{type:mongoose.Schema.Types.ObjectId, ref:"Egg"},
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    farm:{type:mongoose.Schema.Types.ObjectId,ref:"Farm"},
    coupleId:{type:mongoose.Schema.Types.ObjectId,ref:"Couple"},
    birdId:{type:mongoose.Schema.Types.ObjectId,ref:"Bird"},

    eggBirdId:{type:mongoose.Schema.Types.ObjectId,ref:"Bird"},
    action:{type:Boolean, default:false},
    treatmentId:{type:mongoose.Schema.Types.ObjectId,ref:"Treatment"},
    taskDate:{type:Date},
    // treatmentDate:{type:Date},
    // nutritionDate:{type:Date},
    actionTime:{type:Date},
    nutritionId:{type:mongoose.Schema.Types.ObjectId,ref:"Nutrition"},
    taskType:{type:String, required:true}
    // hatchingDate:{type:Date},
    // birdRecordDate:{type:Date},
    // earlyFeedingDate:{type:Date},
    // eggLaidDate:{type:Date},
    // clutchNumber:{type:String},
    // coupleId:{type: String},
    // cageNumber:{type:String},
    // action:{type:Boolean, default:false},
});

const Task =mongoose.model( "Task", TaskSchema );
module.exports=Task;