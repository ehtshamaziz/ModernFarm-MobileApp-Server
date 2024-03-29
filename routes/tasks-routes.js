const express = require("express");
const tasksController = require("../controllers/task-controller");
const router = express.Router();

// Tasks ROUTES

// GET ALL TASKS
router.get("/", tasksController.GetTasks);

// GET TASKS BY ID
router.get("/single/:id", tasksController.GetTasksByID);

// GET ALL TASKS FOR A SPECIFIC USER
router.get("/user/:id", tasksController.GetUserTasks);

router.get('/send/user/:id',tasksController.SendNotification);

// CREATE NEW TASKS
router.post("/", tasksController.CreateTasks);

// UPDATE TASKS BY ID
router.patch("/:id", tasksController.UpdateTasks);

// DELETE TASKS BY ID
router.delete("/:id", tasksController.DeleteTasks);

module.exports = router;
