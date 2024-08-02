const express = require("express");
const userController = require("../controllers/user-controller");
const upload = require("../utils/fileUpload");
const router = express.Router();

// USER ROUTES

// GET ALL USERS
router.get("/", userController.GetUsers);

// GET USER BY ID
router.get("/single/:id", userController.GetUserByID);

// CREATE NEW USER
router.post("/", userController.CreateUser);

// UPDATE USER BY ID
router.patch("/:id", userController.UpdateUser);

// DELETE USER BY ID
router.delete("/:id", userController.DeleteUser);

// REGISTER USER AND SEND OTP
router.post(
  "/register",
  upload.single("imageUri"),
  userController.RegisterUser
);

// VERIFY OTP FOR USER REGISTRATION
router.post("/register/verify", userController.VerifyOTP);

// RESEND REGISTRATION OTP
router.post("/register/resend", userController.ResendRegistrationOTP);

//Login User
router.post("/login", userController.LoginUser);

// REQUEST OTP FOR PASSWORD RESET
router.post("/reset", userController.RequestPasswordReset);

// VERIFY PASSWORD RESET OTP
router.post("/reset/verify", userController.VerifyResetOTP);

// RESEND RESET OTP
router.post("/reset/resend", userController.ResendResetOTP);

router.post("/new-password", userController.NewPassword);

router.post("/update-password", userController.UpdatePassword);

module.exports = router;
