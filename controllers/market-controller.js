const Market = require("../models/market");

// GET ALL MARKET
const GetMarket = async (req, res, next) => {
  console.log("Get all market");
  try {
    const market = await Market.find().populate([
      { path: "user", select: "_id firstName" },
      { path: "bird", select: "birdId price exactBirthDate gender" },
      { path: "couple", select: "coupleId price formationDate" },
      { path: "specie", select: "name" },
      { path: "farm", select: "farmName farmType" },
      { path: "productsId", select: "_id name category" },
    ]);

    return res.status(200).send(market);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE MARKET
const GetMarketByID = async (req, res, next) => {
  try {
    const market = await Market.findById(req.params.id);
    return res.status(200).send(market);
  } catch (err) {
    next(err);
  }
};

// GET ALL MARKET FOR A SPECIFIC USER
const GetUserMarket = async (req, res, next) => {
  console.log("Get all user market");
  try {
    const market = await Market.find({ user: req.params.id }).populate([
      { path: "bird", select: "birdId price exactBirthDate gender" },
      { path: "couple", select: "coupleId price formationDate" },
      { path: "specie", select: "name" },
      { path: "farm", select: "farmName farmType" },
      { path: "productsId", select: "_id name category" },
    ]);
    return res.status(200).send(market);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW MARKET
const CreateMarket = async (req, res, next) => {
  console.log(req.body, "market Data");
  const market = new Market(req.body);
  try {
    await market.save();
    return res.status(200).json(market);
  } catch (err) {
    next(err);
  }
};

// UPDATE MARKET
const UpdateMarket = async (req, res, next) => {
  try {
    const market = await Market.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(market);
  } catch (err) {
    next(err);
  }
};

// DELETE MARKET
const DeleteMarket = async (req, res, next) => {
  try {
    const market = await Market.findByIdAndDelete(req.params.id);
    return res.status(200).json(market);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetMarket,
  GetMarketByID,
  GetUserMarket,
  CreateMarket,
  UpdateMarket,
  DeleteMarket,
};
