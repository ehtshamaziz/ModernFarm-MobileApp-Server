const express = require("express");
const farmController = require("../controllers/farm-controller");
const router = express.Router();

// FARM ROUTES

// GET ALL FARMS
router.get("/", farmController.GetFarms);

// GET FARM BY ID
router.get("/single/:id", farmController.GetFarmByID);

// GET ALL FARMS FOR A SPECIFIC USER
router.get("/user/:id", farmController.GetUserFarms);

// CREATE NEW FARM
router.post("/", farmController.CreateFarm);

// UPDATE FARM BY ID
router.patch("/:id", farmController.UpdateFarm);

// DELETE FARM BY ID
router.delete("/:id", farmController.DeleteFarm);

module.exports = router;
