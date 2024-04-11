const Clutch = require("../models/clutch");
const Egg = require("../models/egg");
const Task=require('../models/tasks');
const User=require("../models/user");
const Worker= require("../models/workers");

var admin = require('firebase-admin');




const GetEggs = async (req, res, next) => {
  console.log("Get all eggs");
  try {
    const egg = await Egg.find();
    return res.status(200).send(egg);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE BIRD
const GetEggsByID = async (req, res, next) => {
  try {
    const egg = await Egg.findById(req.params.id);
    return res.status(200).send(egg);
  } catch (err) {
    next(err);
  }
};

// GET ALL BIRD FOR A SPECIFIC USER
const GetUserEggs = async (req, res, next) => {
  console.log("Get all user egg");
  try {
    const egg = await Egg.find({ clutch: req.params.id })
    .populate("clutch","incubationStartDate")
    .populate("lastTransferID","coupleId")
    .populate("birdID")
    .populate({
      path:"parentCouple",
      select:"coupleId specie",
      populate:{
        path:"specie",
        select:"incubation startFeedingAfter addRingAfter fertilityDays"
      }
    })
    console.log("peeepeepepeps")
    console.log(egg)
    return res.status(200).send(egg);
  } catch (err) {
    console.log("Not Found ");
    next(err);
  }
};

// GET ALL THE EGGS OF A COUPLE
const GetCouplesEggs = async (req,res,next)=>{
  //console.log(req.body);
    try {
    const clutch = await Clutch.find({couple: req.params.id})  
    console.log(clutch)
    const eggs=await Promise.all(
      clutch.map((clutch)=>
      Egg.find({
        clutch :clutch._id
      }))
    )
    return res.status(200).send(eggs);
  } catch (err) {
    console.log("Not Found ");
    next(err);
  }
}

  const GetParentCouplesEggs = async (req,res,next)=>{
  //console.log(req.body);
    try {
    const eggs = await Egg.find({parentCouple: req.params.id})  
    
    return res.status(200).send(eggs);
  } catch (err) {
    console.log("Not Found ");
    next(err);
  }
}


function addDaysToDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// CREATE NEW EGG
const AddEggs = async (req, res, next) => {
  try {
    const { clutch } = req.body;
    const {eggsLaidDate} = req.body;


    const highestEgg = await Egg.findOne({ clutch: clutch }).sort({
      eggNumber: -1,
    });
    const eggNumber = highestEgg
      ? (parseInt(highestEgg.eggNumber) + 1).toString().padStart(3, "0")
      : "001";
    const egg = new Egg({ ...req.body, eggNumber });
    await egg.save();

      const clutches = await Clutch.findById({_id:clutch})
  .populate({
      path:"couple",
      select:"coupleId specie cageNumber user farm",
  });

  const eggs = await Egg.findById(egg._id)
  .populate({
    path: 'clutch', 
    select: 'couple', 
    populate: {
      path: 'couple', 
      select: 'specie user farm', 
      populate: {
        path: 'specie',
        select: 'fertilityDays incubation' 
      }
    }
  });
   const fertilityDate = new Date(eggs?.eggsLaidDate);
   const fertilityDays = eggs.clutch.couple.specie.fertilityDays;
   fertilityDate.setDate(fertilityDate.getDate() + fertilityDays);

   const hatchingDate = new Date(eggs?.eggsLaidDate);
   const incubationDays = eggs.clutch.couple.specie.incubation;
   hatchingDate.setDate(hatchingDate.getDate() + incubationDays);



     const task=new Task({eggId: egg._id,user:clutches.couple.user,farm:clutches.couple.farm,taskType:'fertilityTask',taskDate:fertilityDate});
    const task2=new Task({eggId: egg._id,user:clutches.couple.user,farm:clutches.couple.farm,taskType:'hatchingTask', taskDate:hatchingDate});
     await task.save();
     await task2.save();



    return res.status(200).json(egg);
  } catch (err) {
    next(err);
  }
};

   

// UPDATE BIRD
const UpdateEgg = async (req, res, next) => {
  try {
    const egg = await Egg.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(egg);
  } catch (err) {
    next(err);
  }
};

// DELETE BIRD
const DeleteEgg = async (req, res, next) => {
  try {
    const egg = await Egg.findByIdAndDelete(req.params.id);

   await Task.deleteMany({
      eggId: req.params.id

    });
    return res.status(200).json(egg);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetEggs,
  GetEggsByID,
  AddEggs,
  GetUserEggs,
  UpdateEgg,
  DeleteEgg,
  GetParentCouplesEggs,
  GetCouplesEggs,

};
