const Couple = require("../models/couple");

const GetCouples = async (req, res, next) => {
  console.log("Get all couples");
  try {
    const couple = await Couple.find();
    return res.status(200).send(couple);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE COUPLE
const GetCouplesByID = async (req, res, next) => {
  try {
    const couple = await Couple.findById(req.params.id);
    return res.status(200).send(couple);
  } catch (err) {
    next(err);
  }
};

// GET ALL COUPLE FOR A SPECIFIC USER
const GetUserCouples = async (req, res, next) => {
  console.log("Get all user couple");
  try {
    const couple = await Couple.find({ user: req.params.id })
      .populate("femaleBird")
      .populate("maleBird")
      .populate("farm", "farmType farmName _id");

    return res.status(200).send(couple);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW COUPLE
const AddCouple = async (req, res, next) => {
  try {
    const lastCouple = await Couple.findOne({}, {}, { sort: { coupleId: -1 } });
    let coupleId = "COUPLE-1";

    if (lastCouple && lastCouple.coupleId) {
      const lastId = parseInt(lastCouple.coupleId.split("-")[1]);
      coupleId = `COUPLE-${lastId + 1}`;
    }

    const couple = new Couple({ ...req.body, coupleId });
    await couple.save();

    return res.status(200).json(couple);
  } catch (err) {
    next(err);
  }
};

// UPDATE COUPLE
const UpdateCouple = async (req, res, next) => {
  try {
    const couple = await Couple.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(couple);
  } catch (err) {
    next(err);
  }
};

// DELETE COUPLE
const DeleteCouple = async (req, res, next) => {
  try {
    const couple = await Couple.findByIdAndDelete(req.params.id);
    return res.status(200).json(couple);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetCouples,
  GetCouplesByID,
  AddCouple,
  GetUserCouples,
  UpdateCouple,
  DeleteCouple,
};
