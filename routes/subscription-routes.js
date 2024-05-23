const express = require("express");
const subscriptionController = require("../controllers/subscription-controller");
const router = express.Router();

// Subscription ROUTES

// GET ALL DISEASE
router.get("/", subscriptionController.GetSubscription);

// GET DISEASE BY ID
router.get("/single/:id", subscriptionController.GetSubscriptionByID);

// GET ALL DISEASE FOR A SPECIFIC USER
router.get("/user/:id", subscriptionController.GetUserSubscription);

// CREATE NEW DISEASE
router.post("/", subscriptionController.CreateSubscription);

// UPDATE DISEASE BY ID
router.patch("/:id", subscriptionController.UpdateSubscription);

// DELETE DISEASE BY ID
router.delete("/:id", subscriptionController.DeleteSubscription);

module.exports = router;
