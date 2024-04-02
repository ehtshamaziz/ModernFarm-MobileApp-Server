const express = require("express");
const workersController = require("../controllers/worker-controller");
const router = express.Router();
const { createJWT, verifyJWT } = require("../middleware/jwt");

// FARM ROUTES

// GET ALL FARMS
router.get("/", workersController.GetWorkers);

// GET FARM BY ID
router.get("/single/:id", workersController.GetWorkersByID);

// GET ALL FARMS FOR A SPECIFIC USER
router.get("/user/:id", workersController.GetUserWorkers);

// CREATE NEW FARM
router.post("/", workersController.CreateWorkers);


router.post("/verify", workersController.VerifyWorker, createJWT);


// UPDATE FARM BY ID
router.patch("/:id", workersController.UpdateWorkers);

// UPDATE MULTIPLE WORKERS
router.patch("/", workersController.UpdateMultipleWorkers);

// DELETE FARM BY ID
router.delete("/:id", workersController.DeleteWorkers);

router.post("/login", workersController.LoginWorker, createJWT);


module.exports = router;
