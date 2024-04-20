const express = require("express");
const incomeController = require("../controllers/income-controller");
const router = express.Router();

// FARM ROUTES

// GET ALL FARMS
router.get("/", incomeController.GetIncomes);

// GET FARM BY ID
router.get("/single/:id", incomeController.GetIncomeByID);

// GET ALL FARMS FOR A SPECIFIC USER
router.get("/user/:id", incomeController.GetUserIncomes);

// CREATE NEW FARM
router.post("/", incomeController.CreateIncome);

// UPDATE FARM BY ID
router.patch("/:id", incomeController.UpdateIncome);

// DELETE FARM BY ID
router.delete("/:id", incomeController.DeleteIncome);

module.exports = router;
