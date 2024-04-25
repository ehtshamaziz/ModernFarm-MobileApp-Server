const express = require("express");
const farmNoteController = require("../controllers/farm-note-controller");
const router = express.Router();

// FarmNote ROUTES

// GET ALL DISEASE
router.get("/", farmNoteController.GetFarmNote);

// GET DISEASE BY ID
router.get("/single/:id", farmNoteController.GetFarmNoteByID);

// GET ALL DISEASE FOR A SPECIFIC USER
router.get("/user/:id", farmNoteController.GetUserFarmNote);

// CREATE NEW DISEASE
router.post("/", farmNoteController.CreateFarmNote);

// UPDATE DISEASE BY ID
router.patch("/:id", farmNoteController.UpdateFarmNote);

// DELETE DISEASE BY ID
router.delete("/:id", farmNoteController.DeleteFarmNote);

module.exports = router;
