const Egg=require('../models/egg');


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
    const egg = await Egg.find({ clutch: req.params.id });
    return res.status(200).send(egg);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW BIRD
const AddEggs= async (req, res, next) => {
  const egg = new Egg(req.body);
  try {
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
const DeleteEgg= async (req, res, next) => {
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
};
