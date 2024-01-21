const Farm = require("../models/farm");
// const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

//        ********** FUNCTIONS ***********

// GET ALL FARMS
const GetFarms = async (req, res, next) => {
  console.log("Get all farms");
  try {
    const farm = await Farm.find();
    return res.status(200).send(farm);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE FARM
const GetFarmByID = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    return res.status(200).send(farm);
  } catch (err) {
    next(err);
  }
};

// GET ALL FARMS FOR A SPECIFIC USER
const GetUserFarms = async (req, res, next) => {
  console.log("Get all user farms");
  try {
    const farms = await Farm.find({ user: req.params.id });
    return res.status(200).send(farms);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW FARM
const CreateFarm = async (req, res, next) => {
  const farm = new Farm(req.body);
  try {
    await farm.save();
    return res.status(200).json(farm);
  } catch (err) {
    next(err);
  }
};

// UPDATE FARM
const UpdateFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(farm);
  } catch (err) {
    next(err);
  }
};

// DELETE FARM
const DeleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    return res.status(200).json(farm);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetFarms,
  GetFarmByID,
  CreateFarm,
  UpdateFarm,
  DeleteFarm,
  GetUserFarms,
};
