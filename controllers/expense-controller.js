const Expense = require("../models/expense");
// const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

//        ********** FUNCTIONS ***********

// GET ALL EXPENSES
const GetExpenses = async (req, res, next) => {
  console.log("Get all expenses");
  try {
    const expense = await Expense.find();
    return res.status(200).send(expense);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE EXPENSE
const GetExpenseByID = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    return res.status(200).send(expense);
  } catch (err) {
    next(err);
  }
};

// GET ALL EXPENSES FOR A SPECIFIC USER
const GetUserExpenses = async (req, res, next) => {
  console.log("Get all user expenses");
  try {
    const expenses = await Expense.find({ user: req.params.id });
    return res.status(200).send(expenses);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW EXPENSE
const CreateExpense = async (req, res, next) => {
  const expense = new Expense(req.body);
  console.log(req.body);
  try {
    await expense.save();
    return res.status(200).json(expense);
  } catch (err) {
    next(err);
  }
};
// https://res.cloudinary.com/dqnz3rzt5/image/upload/v1705765421/ModernFarm/zsyp6lmzqllowy7bbuwp.webp

// UPDATE EXPENSE
const UpdateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(expense);
  } catch (err) {
    next(err);
  }
};

// DELETE EXPENSE
const DeleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    return res.status(200).json(expense);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetExpenses,
  GetExpenseByID,
  CreateExpense,
  UpdateExpense,
  DeleteExpense,
  GetUserExpenses,
};
