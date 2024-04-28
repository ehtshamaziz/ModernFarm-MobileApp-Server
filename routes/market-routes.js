const express = require("express");
const marketController = require("../controllers/market-controller");
const router = express.Router();

// Disease ROUTES

// GET ALL MARKET
router.get("/", marketController.GetMarket);

// GET MARKET BY ID
router.get("/single/:id", marketController.GetMarketByID);

// GET ALL MARKET FOR A SPECIFIC USER
router.get("/user/:id", marketController.GetUserMarket);

// CREATE NEW MARKET
router.post("/", marketController.CreateMarket);

// UPDATE MARKET BY ID
router.patch("/:id", marketController.UpdateMarket);

// DELETE MARKET BY ID
router.delete("/:id", marketController.DeleteMarket);

module.exports = router;
