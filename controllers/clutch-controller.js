const Clutch = require("../models/clutch");

const GetClutches = async (req, res, next) => {
  console.log("Get all clutch");
  try {
    const clutch = await Clutch.find();
    return res.status(200).send(clutch);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE CLUTCH
const GetClutchesByID = async (req, res, next) => {
  try {
    const clutch = await Clutch.findById(req.params.id);
    return res.status(200).send(clutch);
  } catch (err) {
    next(err);
  }
};

// GET ALL CLUTCH FOR A SPECIFIC COUPLE
const GetCoupleClutches = async (req, res, next) => {
  console.log("Get all clutch for a couple");
  try {
    const clutch = await Clutch.find({ couple: req.params.id })
        .populate({
        path: 'couple',
        populate: {
          path: 'specie',
          model: 'Specie',
        }
      })
       
    return res.status(200).send(clutch);
  } catch (err) {
    next(err);
  }
};

// GET ALL CLUTCH FOR A SPECIFIC USER
const GetUserClutches = async (req, res, next) => {
  console.log("Get all clutch for a user");
  try {
    const clutch = await Clutch.find({ user: req.params.id });
    return res.status(200).send(clutch);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW CLUTCH
const AddClutches = async (req, res, next) => {
  try {
    const { couple } = req.body;

    const highestClutch = await Clutch.findOne({ couple: couple }).sort({
      clutchNumber: -1,
    });
    const clutchNumber = highestClutch
      ? (parseInt(highestClutch.clutchNumber) + 1).toString().padStart(3, "0")
      : "001";

    const clutch = new Clutch({ ...req.body, clutchNumber });
    await clutch.save();
    return res.status(200).json(clutch);
  } catch (err) {
    next(err);
  }
};

// UPDATE CLUTCH
const UpdateClutch = async (req, res, next) => {
  try {
    const clutch = await Clutch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(clutch);
  } catch (err) {
    next(err);
  }
};

// DELETE CLUTCH
const DeleteClutch = async (req, res, next) => {
  try {
    const clutch = await Clutch.findByIdAndDelete(req.params.id);
    return res.status(200).json(clutch);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetClutches,
  GetClutchesByID,
  AddClutches,
  GetUserClutches,
  GetCoupleClutches,
  UpdateClutch,
  DeleteClutch,
};
