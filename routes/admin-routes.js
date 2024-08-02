const express = require("express");
const adminController = require("../controllers/admin-controller");

const router = express.Router();

// ADMIN ROUTES

// REGISTER ADMIN
router.post("/register", adminController.RegisterAdmin);

// LOGIN ADMIN
router.post("/login", adminController.LoginAdmin);

module.exports = router;
