const Finance = require("../models/finance");

// GET ALL FINANCES
const GetFinances = async (req, res, next) => {
  console.log("Get all finances");
  try {
    const finance = await Finance.find().populate("farm", "farmType farmName");
    return res.status(200).send(finance);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE FINANCE
const GetFinanceByID = async (req, res, next) => {
  try {
    const finance = await Finance.findById(req.params.id);
    return res.status(200).send(finance);
  } catch (err) {
    next(err);
  }
};

// GET ALL FINANCES FOR A SPECIFIC USER
const GetUserFinances = async (req, res, next) => {
  console.log("Get all user finances");
  try {
    const finances = await Finance.find({ user: req.params.id }).populate(
      "farm",
      "farmType farmName"
    );
    return res.status(200).send(finances);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW FINANCE
const CreateFinance = async (req, res, next) => {
  const finance = new Finance(req.body);
  console.log(req.body);
  try {
    await finance.save();
    return res.status(200).json(finance);
  } catch (err) {
    next(err);
  }
};

// UPDATE FINANCE
const UpdateFinance = async (req, res, next) => {
  try {
    const finance = await Finance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(finance);
  } catch (err) {
    next(err);
  }
};

// DELETE FINANCE
const DeleteFinance = async (req, res, next) => {
  try {
    const finance = await Finance.findByIdAndDelete(req.params.id);
    return res.status(200).json(finance);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetFinances,
  GetFinanceByID,
  CreateFinance,
  UpdateFinance,
  DeleteFinance,
  GetUserFinances,
};
