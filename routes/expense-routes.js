const express = require("express");
const expenseController = require("../controllers/expense-controller");
const router = express.Router();

// FARM ROUTES

// GET ALL FARMS
router.get("/", expenseController.GetExpenses);

// GET FARM BY ID
router.get("/single/:id", expenseController.GetExpenseByID);

// GET ALL FARMS FOR A SPECIFIC USER
router.get("/user/:id", expenseController.GetUserExpenses);

// CREATE NEW FARM
router.post("/", expenseController.CreateExpense);

// UPDATE FARM BY ID
router.patch("/:id", expenseController.UpdateExpense);

// DELETE FARM BY ID
router.delete("/:id", expenseController.DeleteExpense);

module.exports = router;
