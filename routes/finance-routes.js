const express = require("express");
const financeController = require("../controllers/finance-controller");
const router = express.Router();

// FARM ROUTES

// GET ALL FARMS
router.get("/", financeController.GetFinances);

// GET FARM BY ID
router.get("/single/:id", financeController.GetFinanceByID);

// GET ALL FARMS FOR A SPECIFIC USER
router.get("/user/:id", financeController.GetUserFinances);

// CREATE NEW FARM
router.post("/", financeController.CreateFinance);

// UPDATE FARM BY ID
router.patch("/:id", financeController.UpdateFinance);

// DELETE FARM BY ID
router.delete("/:id", financeController.DeleteFinance);

module.exports = router;
