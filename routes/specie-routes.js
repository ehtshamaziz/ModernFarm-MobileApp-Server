const express =require("express");
const speciesController = require("../controllers/specie-controller");
const router=express.Router();

// Post Species
router.post("/",speciesController.PostSpecie);

// Get Species
router.get("/",speciesController.GetSpecies);


router.delete("/",speciesController.DeleteSpecie);

module.exports=router;
