const express = require("express");
const customerController = require("../controllers/customer-controller");
const { createJWT, verifyJWT } = require("../middleware/jwt");

const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// CUSTOMER ROUTES

// GET ALL CUSTOMERS
router.get("/", customerController.GetCustomers);

// GET CUSTOMER BY ID
router.get("/single/:id", customerController.GetCustomerByID);

// CREATE NEW CUSTOMER
router.post("/", customerController.CreateCustomer);

// UPDATE CUSTOMER BY ID
router.patch("/:id", customerController.UpdateCustomer);

// DELETE CUSTOMER BY ID
router.delete("/:id", customerController.DeleteCustomer);

// INITIATE USER
router.post(
  "/initiate",
  upload.single("imageUri"),
  customerController.RegisterCustomerInitiate
);

// REGISTER CUSTOMER
router.post("/register", customerController.RegisterCustomer, createJWT);

//Login Customer
router.post("/login", customerController.LoginCustomer, createJWT);

router.post("/sendEmail", customerController.OtpEmail);

router.post("/reset", customerController.VerifyResetOTP);

router.get("/temp-data", customerController.GetTempData);

router.post("/newpassword", customerController.NewPassword);

module.exports = router;
