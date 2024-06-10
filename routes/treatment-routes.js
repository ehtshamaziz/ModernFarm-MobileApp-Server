const express = require("express");
const treatmentController = require("../controllers/treatment-controller");
const router = express.Router();

// TREATMENT ROUTES

// GET ALL TREATMENT
router.get("/", treatmentController.GetTreatment);

// GET TREATMENT BY ID
router.get("/single/:id", treatmentController.GetTreatmentByID);

// GET ALL TREATMENT FOR A SPECIFIC USER
router.get("/user/:id", treatmentController.GetUserTreatment);

// CREATE NEW TREATMENT
router.post("/", treatmentController.CreateTreatment);


// UPDATE TREATMENT BY ID
router.patch("/:id", treatmentController.UpdateTreatment);

// DELETE TREATMENT BY ID
router.delete("/:id", treatmentController.DeleteTreatment);

module.exports = router;
