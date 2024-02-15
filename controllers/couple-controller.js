const Couple = require("../models/couple");
const Clutch = require("../models/clutch");

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
    const couple = await Couple.findById(req.params.id)
    .populate("farm","farmName farmType")
    .populate("specie","name")
    return res.status(200).send(couple);
  } catch (err) {
    next(err);
  }
};

// GET ALL COUPLE FOR A SPECIFIC USER
const GetUserCouples = async (req, res, next) => {
  console.log("Get all user couple");
  try {
    const couples = await Couple.find({ user: req.params.id })
      .populate(
        "femaleBird",
        "_id birdName birdId gender price birdSpecie imageURL"
      )
      .populate(
        "maleBird",
        "_id birdName birdId gender price birdSpecie imageURL"
      )
      .populate("farm", "farmType farmName _id")
      .populate("specie")
      .populate("descendants","status")

      console.log(couples)

    const couplesWithClutches = await Promise.all(
      couples.map(async (couple) => {
        const clutchesCount = await Clutch.countDocuments({
          couple: couple._id,
        });
        return { ...couple.toObject(), clutches: clutchesCount };
      })
    );
    return res.status(200).send(couplesWithClutches);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW COUPLE
const AddCouple = async (req, res, next) => {
  try {

    const {maleBird,femaleBird}=req.body;
    const existingCouple=await Couple.findOne({maleBird,femaleBird});
    if (existingCouple) {
      return res.status(300).json({ message: "This male and female bird couple already exists." });
    }
    


    const lastCouple = await Couple.findOne({}, {}, { sort: { coupleId: -1 } });
    let coupleId = "COUPLE-001";


    if (lastCouple && lastCouple.coupleId) {
      const lastId = parseInt(lastCouple.coupleId.split("-")[1]);
      const newId = lastId + 1;
      const paddedId = String(newId).padStart(3, '0'); 
      coupleId = `COUPLE-${paddedId}`;
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
