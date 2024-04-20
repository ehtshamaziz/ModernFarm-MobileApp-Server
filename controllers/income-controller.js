const Income = require("../models/income");


//        ********** FUNCTIONS ***********

// GET ALL PRODUCTS
const GetIncomes = async (req, res, next) => {
  console.log("Get all incomes");
  try {
    const income = await Income.find();
    return res.status(200).send(income);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE INCOME
const GetIncomeByID = async (req, res, next) => {
  try {
    const income = await Income.findById(req.params.id);
    return res.status(200).send(income);
  } catch (err) {
    next(err);
  }
};

// GET ALL PRODUCTS FOR A SPECIFIC USER
const GetUserIncomes = async (req, res, next) => {
  console.log("Get all user incomes");
  try {
    const incomes = await Income.find({ user: req.params.id });
    return res.status(200).send(incomes);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW INCOME
const CreateIncome = async (req, res, next) => {
  const income = new Income(req.body);
  console.log(req.body);
  try {
    await income.save();
    return res.status(200).json(income);
  } catch (err) {
    next(err);
  }
};
// https://res.cloudinary.com/dqnz3rzt5/image/upload/v1705765421/ModernFarm/zsyp6lmzqllowy7bbuwp.webp

// UPDATE INCOME
const UpdateIncome = async (req, res, next) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(income);
  } catch (err) {
    next(err);
  }
};

// DELETE INCOME
const DeleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    return res.status(200).json(income);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetIncomes,
  GetIncomeByID,
  CreateIncome,
  UpdateIncome,
  DeleteIncome,
  GetUserIncomes,
};
