const Nutrition = require("../models/nutrition");
const Task =require("../models/tasks");
const User=require("../models/user");




var admin = require('firebase-admin');

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


    const task=new Task({taskDate:nutrition.nutritionDate,nutritionId: nutrition._id,coupleId:element,user:nutrition.user,farm:nutrition.farm,taskType:'nutrition'});
    await task.save();

    }))
  }
  if(nutrition.bird && nutrition.bird.length){
    await Promise.all(nutrition.bird.map(async(element)=>{

      console.log(nutrition.bird.length)
      console.log("birdssssssssss nutrition")

    const task=new Task({taskDate:nutrition.nutritionDate,nutritionId: nutrition._id,birdId:element,user:nutrition.user,farm:nutrition.farm,taskType:'nutrition'});
    await task.save();

    })
      )
  }
    return res.status(200).json(nutrition);
  } catch (err) {
    next(err);
  }
};



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
