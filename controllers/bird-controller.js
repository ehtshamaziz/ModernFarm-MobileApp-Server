const Bird = require("../models/birds");
const Couple=require("../models/couple");
const Egg=require("../models/egg");

const GetBirds = async (req, res, next) => {
  console.log("Get all birds");
  try {
    const bird = await Bird.find();
    return res.status(200).send(bird);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE BIRD
const GetBirdsByID = async (req, res, next) => {
  try {
    const bird = await Bird.findById(req.params.id);
    return res.status(200).send(bird);
  } catch (err) {
    next(err);
  }
};

// GET ALL BIRD FOR A SPECIFIC USER
const GetUserBirds = async (req, res, next) => {
  console.log("Get all user bird");
  try {
    const bird = await Bird.find({ user: req.params.id })
      .populate("farm", "farmType farmName _id")
      .populate("couple","coupleId")
      .populate("birdSpecie","_id name")
      .populate("birdOwner", "_id firstName lastName");
    console.log(bird);
    return res.status(200).send(bird);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW BIRD
const AddBirds = async (req, res, next) => {
  try {
  
    const lastBird = await Bird.findOne({}, {}, { sort: { birdId: -1 } });
    let birdId = "BIRD-1";

    if (lastBird && lastBird.birdId) {
      const lastId = parseInt(lastBird.birdId.split("-")[1]);
      birdId = `BIRD-${lastId + 1}`;
    }

    const bird = new Bird({ ...req.body, birdId });
    await bird.save();

    if (req.body.couple) {
  
      const coupleId = req.body.couple; 
      console.log(coupleId);
    try {
      const updatedCouple = await Couple.findByIdAndUpdate(coupleId, 
      { $push: { descendants: bird._id } }, 
      { new: true } 
    );
    console.log(updatedCouple);
  } catch (error) {
  
    console.error("Error updating Couple document:", error);
  }}

  if(req.body.eggID){
    try{
      const updateEgg=await Egg.findByIdAndUpdate(req.body.eggID,{$set:{status:"excluded"}},{ new: true })

    console.log(updateEgg);
    } catch (error) {
      console.log(error);
    }

  }

    return res.status(200).json(bird);
  } catch (err) {
    next(err);
  }
};

// UPDATE BIRD
const UpdateBird = async (req, res, next) => {
  try {
    const bird = await Bird.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(bird);
  } catch (err) {
    next(err);
  }
};

// DELETE BIRD
const DeleteBird = async (req, res, next) => {
  try {
    const bird = await Bird.findByIdAndDelete(req.params.id);
    return res.status(200).json(bird);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetBirds,
  GetBirdsByID,
  AddBirds,
  GetUserBirds,
  UpdateBird,
  DeleteBird,
};
