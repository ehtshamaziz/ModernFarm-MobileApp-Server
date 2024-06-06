const express = require("express");
const questionController = require("../controllers/question-controller");
const router = express.Router();

// Disease ROUTES

// GET ALL QUESTION
router.get("/", questionController.GetQuestion);

// GET QUESTION BY ID
router.get("/single/:id", questionController.GetQuestionByID);

// GET ALL QUESTION FOR A SPECIFIC USER
router.get("/user/:id", questionController.GetUserQuestion);

// CREATE NEW QUESTION
router.post("/", questionController.CreateQuestion);

// UPDATE QUESTION BY ID
router.patch("/:id", questionController.UpdateQuestion);

// DELETE QUESTION BY ID
router.delete("/:id", questionController.DeleteQuestion);

module.exports = router;
