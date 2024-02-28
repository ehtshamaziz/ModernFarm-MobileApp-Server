const express = require("express");
const diseaseController = require("../controllers/disease-controller");
const router = express.Router();

// Disease ROUTES

// GET ALL DISEASE
router.get("/", diseaseController.GetDisease);

// GET DISEASE BY ID
router.get("/single/:id", diseaseController.GetDiseaseByID);

// GET ALL DISEASE FOR A SPECIFIC USER
router.get("/user/:id", diseaseController.GetUserDisease);

// CREATE NEW DISEASE
router.post("/", diseaseController.CreateDisease);

// UPDATE DISEASE BY ID
router.patch("/:id", diseaseController.UpdateDisease);

// DELETE DISEASE BY ID
router.delete("/:id", diseaseController.DeleteDisease);

module.exports = router;
