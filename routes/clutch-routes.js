const express=require("express");
const ClutchController=require("../controllers/clutch-controller");
const router=express.Router();


// GET ALL CLUTCH
router.get("/", ClutchController.GetClutches);

// GET CLUTCH BY ID
router.get("/single/:id", ClutchController.GetClutchesByID);

// GET ALL CLUTCH FOR A SPECIFIC USER
router.get("/user/:id", ClutchController.GetUserClutches);

// Add CLUTCH 
router.post("/", ClutchController.AddClutches);

// UPDATE CLUTCH BY ID
router.patch("/:id", ClutchController.UpdateClutch);

// DELETE CLUTCH BY ID
router.delete("/:id", ClutchController.DeleteClutch);

module.exports = router;