const express=require("express");
const EggController=require("../controllers/egg-controller");
const router=express.Router();


// GET ALL BIRD
router.get("/", EggController.GetEggs);

// GET BIRD BY ID
router.get("/single/:id", EggController.GetEggsByID);

// GET ALL BIRD FOR A SPECIFIC USER
router.get("/user/:id", EggController.GetUserEggs);

// Add BIRD 
router.post("/", EggController.AddEggs);


router.get("/couple/:id",EggController.GetCouplesEggs);


router.get("/parentCouple/:id",EggController.GetParentCouplesEggs);
// UPDATE BIRD BY ID
router.patch("/:id", EggController.UpdateEgg);

// DELETE BIRD BY ID
router.delete("/:id", EggController.DeleteEgg);

module.exports = router;