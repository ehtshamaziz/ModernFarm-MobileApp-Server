const Bird=require('../models/birds');


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
    const bird = await Bird.find({ user: req.params.id });
    return res.status(200).send(bird);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW BIRD
const AddBirds= async (req, res, next) => {
  const bird = new Bird(req.body);
  try {
    await bird.save();
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
const DeleteBird= async (req, res, next) => {
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
