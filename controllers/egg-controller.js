const Clutch = require("../models/clutch");
const Egg = require("../models/egg");

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


// CREATE NEW EGG
const AddEggs = async (req, res, next) => {
  try {
    // const { clutch } = req.body;

    const highestEgg = await Egg.findOne().sort({
      eggNumber: -1,
    });
    const eggNumber = highestEgg
      ? (parseInt(highestEgg.eggNumber) + 1).toString().padStart(3, "0")
      : "001";
    const egg = new Egg({ ...req.body, eggNumber });
    await egg.save();
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
