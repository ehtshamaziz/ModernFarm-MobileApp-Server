const express = require("express");
const financeController = require("../controllers/finance-controller");
const router = express.Router();

// FINANCE ROUTES

// GET ALL FINANCES
router.get("/", financeController.GetFinances);

// GET FINANCE BY ID
router.get("/single/:id", financeController.GetFinanceByID);

// GET ALL FINANCES FOR A SPECIFIC USER
router.get("/user/:id", financeController.GetUserFinances);

// CREATE NEW FINANCE
router.post("/", financeController.CreateFinance);

// UPDATE FINANCE BY ID
router.patch("/:id", financeController.UpdateFinance);

// DELETE FINANCE BY ID
router.delete("/:id", financeController.DeleteFinance);

module.exports = router;
