const express = require("express");
const coupleController = require("../controllers/couple-controller");
const router = express.Router();

// COUPLE ROUTES

// GET ALL COUPLES
router.get("/", coupleController.GetCouples);

// GET COUPLE BY ID
router.get("/single/:id", coupleController.GetCouplesByID);

// GET ALL COUPLES FOR A SPECIFIC USER
router.get("/user/:id", coupleController.GetUserCouples);


// GET ALL RATE COUPLES FOR A SPECIFIC USER
router.get("/calculation/user/:id", coupleController.GetUserCalculateCouples);

// CREATE NEW COUPLE
router.post("/", coupleController.AddCouple);

// UPDATE COUPLE BY ID
router.patch("/:id", coupleController.UpdateCouple);

// DELETE COUPLE BY ID
router.delete("/:id", coupleController.DeleteCouple);

module.exports = router;
