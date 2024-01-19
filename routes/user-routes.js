const express = require("express");
const userController = require("../controllers/user-controller");
const { createJWT, verifyJWT } = require("../middleware/jwt");

const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

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

// // INITIATE USER
// router.post(
//   "/initiate",
//   userController.UploadFileMulter,
//   userController.RegisterUserInitiate
// );

// // REGISTER USER
// router.post("/register", userController.RegisterUser, createJWT);

// REGISTER USER
router.post(
  "/register",
  userController.UploadFileMulter,
  userController.RegisterUser
);

// VERIFY OTP FOR USER REGISTRATION
router.post("/register/verify", userController.VerifyOTP, createJWT);

//Login User
router.post("/login", userController.LoginUser, createJWT);

// REQUEST OTP FOR PASSWORD RESET
router.post("/reset", userController.RequestPasswordReset);

// VERIFY PASSWORD RESET OTP
router.post("/reset/verify", userController.VerifyResetOTP);

// router.post("/sendEmail", userController.OtpEmail);

// router.post("/reset", userController.VerifyResetOTP);

// router.get("/temp-data", userController.GetTempData);

router.post("/new-password", userController.NewPassword);

module.exports = router;
