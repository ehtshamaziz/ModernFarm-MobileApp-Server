const Nutrition = require("../models/nutrition");
const Task =require("../models/tasks");
const Worker=require("../models/workers");
const User=require("../models/user");
const {sendCronNotification}=require('../utils/sendNotification');



var admin = require('firebase-admin');
const workers = require("../models/workers");

// GET ALL NUTRITION
const GetNutritions = async (req, res, next) => {
  console.log("Get all farms");
  try {
    const nutrition = await Nutrition.find();
    return res.status(200).send(nutrition);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE NUTRITION
const GetNutritionsByID = async (req, res, next) => {
  try {
    const nutrition = await Nutrition.findById(req.params.id);
    return res.status(200).send(nutrition);
  } catch (err) {
    next(err);
  }
};

// GET ALL NUTRITION FOR A SPECIFIC USER
const GetUserNutritions = async (req, res, next) => {
  console.log("Get all user nutritions");
  try {
    const nutrition = await Nutrition.find({ user: req.params.id });
    nutrition.save();

    return res.status(200).send(nutrition);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW NUTRITION
const CreateNutritions = async (req, res, next) => {
  const nutrition = new Nutrition(req.body);
  try {
    await nutrition.save();
    
  if(nutrition.couple && nutrition.couple.length){
    await Promise.all(nutrition.couple.map(async (element)=>{


    const task=new Task({taskDate:nutrition.nutritionDate,nutritionId: nutrition._id,coupleId:element,user:nutrition.user,farm:nutrition.farm,taskType:'nutritionTask'});
    await task.save();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); 
    const startOfTaskDate = new Date(task.taskDate);
    startOfTaskDate.setHours(0, 0, 0, 0);
          console.log(startOfToday)
      console.log(startOfTaskDate)

    if(startOfTaskDate <=startOfToday){
      console.log("cccc")
       await notificationEndpoint(req.body.user,task);
    }

    }))
  }
  if(nutrition.bird && nutrition.bird.length){
    await Promise.all(nutrition.bird.map(async(element)=>{


    const task=new Task({taskDate:nutrition.nutritionDate,nutritionId: nutrition._id,birdId:element,user:nutrition.user,farm:nutrition.farm,taskType:'nutritionTask'});
    await task.save();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); 
    const startOfTaskDate = new Date(task.taskDate);
    startOfTaskDate.setHours(0, 0, 0, 0);
    
    if(startOfTaskDate <=startOfToday){
       await notificationEndpoint(req.body.user,task);
    }

    })
      )
  }
    return res.status(200).json(nutrition);
  } catch (err) {
    next(err);
  }
};


async function notificationEndpoint(user,task){
  const workers=await Worker.find({user:user._id});
  const users=await User.findOne({user:user._id});

  await sendCronNotification(users.userToken,task)


  for(const worker of workers){

    if(worker.accessRights[task.taskType] && worker.workerToken){
      await sendCronNotification(worker.workerToken,task)
    }
  }

}

// UPDATE NUTRITION
const UpdateNutritions = async (req, res, next) => {
  try {
    const nutrition = await Nutrition.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(nutrition);
  } catch (err) {
    next(err);
  }
};

// DELETE NUTRITION
const DeleteNutritions = async (req, res, next) => {
  try {
    const nutrition = await Nutrition.findByIdAndDelete(req.params.id);
     await Task.deleteMany({
      nutritionId: req.params.id
    });
    return res.status(200).json(nutrition);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetNutritions,
  GetNutritionsByID,
  CreateNutritions,
  UpdateNutritions,
  DeleteNutritions,
  GetUserNutritions,
};
