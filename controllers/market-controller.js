const Market=require('../models/market')


// GET ALL MARKET
const GetMarket = async (req, res, next) => {
  console.log("Get all market");
  try {
    const market = await Market.find();
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
    const market = await Market.find({ user: req.params.id });
    return res.status(200).send(market);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW MARKET
const CreateMarket = async (req, res, next) => {
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


module.exports={
    GetMarket,
    GetMarketByID,
    GetUserMarket,
    CreateMarket,
    UpdateMarket,
    DeleteMarket


}