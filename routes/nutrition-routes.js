const express = require("express");
const nutritionController = require("../controllers/nutrition-controller");
const router = express.Router();

// FARM ROUTES

// GET ALL FARMS
router.get("/", nutritionController.GetNutritions);

// GET FARM BY ID
router.get("/single/:id", nutritionController.GetNutritionsByID);

// GET ALL FARMS FOR A SPECIFIC USER
router.get("/user/:id", nutritionController.GetUserNutritions);

// CREATE NEW FARM
router.post("/", nutritionController.CreateNutritions);

// UPDATE FARM BY ID
router.patch("/:id", nutritionController.UpdateNutritions);

// DELETE FARM BY ID
router.delete("/:id", nutritionController.DeleteNutritions);

module.exports = router;
