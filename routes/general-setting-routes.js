const express = require("express");
const generalSettingController = require("../controllers/general-setting-controller");
const router = express.Router();

// Disease ROUTES

// GET ALL QUESTION
router.get("/", generalSettingController.GetGeneralSetting);

// GET QUESTION BY ID
router.get("/single/:id", generalSettingController.GetGeneralSettingByID);

// GET ALL QUESTION FOR A SPECIFIC USER
router.get("/user/:id", generalSettingController.GetUserGeneralSetting);

// CREATE NEW QUESTION
router.post("/", generalSettingController.CreateGeneralSetting);

// UPDATE QUESTION BY ID
router.patch("/:id", generalSettingController.UpdateGeneralSetting);

// DELETE QUESTION BY ID
router.delete("/:id", generalSettingController.DeleteGeneralSetting);

module.exports = router;
