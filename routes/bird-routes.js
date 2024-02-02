const express=require("express");
const BirdController=require("../controllers/bird-controller");
const router=express.Router();


// GET ALL BIRD
router.get("/", BirdController.GetBirds);

// GET BIRD BY ID
router.get("/single/:id", BirdController.GetBirdsByID);

// GET ALL BIRD FOR A SPECIFIC USER
router.get("/user/:id", BirdController.GetUserBirds);

// CREATE BIRD FARM
router.post("/", BirdController.AddBirds);

// UPDATE BIRD BY ID
router.patch("/:id", BirdController.UpdateBird);

// DELETE BIRD BY ID
router.delete("/:id", BirdController.DeleteBird);

module.exports = router;