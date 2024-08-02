const express = require("express");
const workersController = require("../controllers/worker-controller");
const router = express.Router();

// WORKER ROUTES

// GET ALL FARMS
router.get("/", workersController.GetWorkers);

// GET WORKER BY ID
router.get("/single/:id", workersController.GetWorkersByID);

// GET ALL FARMS FOR A SPECIFIC USER
router.get("/user/:id", workersController.GetUserWorkers);

// CREATE NEW WORKER
router.post("/", workersController.CreateWorkers);

router.post("/verify", workersController.VerifyWorker);

// UPDATE WORKER BY ID
router.patch("/:id", workersController.UpdateWorkers);

// DELETE WORKER BY ID
router.delete("/:id", workersController.DeleteWorkers);

router.post("/login", workersController.LoginWorker);


module.exports = router;
