const Customer = require("../models/customer");
const bcrypt = require("bcrypt");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const { sendOTP } = require("../utils/emailSender");

//        ********** FUNCTIONS ***********

// GET ALL CUSTOMERS
const GetCustomers = async (req, res, next) => {
  console.log("Get all customers");
  try {
    const customer = await Customer.find();
    return res.status(200).send(customer);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE CUSTOMER
const GetCustomerByID = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    return res.status(200).send(customer);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW CUSTOMER
const CreateCustomer = async (req, res, next) => {
  const customer = new Customer(req.body);
  try {
    await customer.save();
    return res.status(200).json(customer);
  } catch (err) {
    next(err);
  }
};

// UPDATE CUSTOMER
const UpdateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(customer);
  } catch (err) {
    next(err);
  }
};

// DELETE CUSTOMER
const DeleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    return res.status(200).json(customer);
  } catch (err) {
    next(err);
  }
};

// SEND OTP TO USER
const OtpEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ email: email });
    if (existingCustomer) {
      const otp = generateOTP();
      saveOTP(email, otp);
      await sendOTP(email, otp);
      res.status(200).json({ message: "OTP sent to email" });
    } else {
      return res.status(409).json({ message: "Email Not registered." });
    }
  } catch (err) {
    next("Error is: " + err);
  }
};

// INITIATE CUSTOMER REGISTRATION ON SIGNUP AND SEND OTP
const RegisterCustomerInitiate = async (req, res, next) => {
  const { firstName, familyName, phoneNumber, countryCode, email, password } =
    req.body;

  const imageFile = req.file;
  const imageFilePath = imageFile ? imageFile.path : null;
  console.error(imageFile);

  try {
    const existingCustomer = await Customer.findOne({ email: email });
    if (existingCustomer) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const otp = generateOTP();
    saveOTP(email, otp);
    await sendOTP(email, otp);

    saveTempUserData(email, {
      firstName,
      familyName,
      phoneNumber,
      countryCode,
      email,
      password,
      imageFilePath,
    });
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    next("Error is: " + err);
  }
};

const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

const verifyOTP = (email, otp) => {
  const storedData = tempStore[email];
  if (storedData && storedData.otp === otp) {
    return true;
  } else {
    return false;
  }
};

const VerifyResetOTP = (req, res, next) => {
  const { email, otp } = req.body;
  console.log("Reset Password: " + otp);
  const storedData = tempStore[email];

  if (storedData && storedData.otp === otp) {
    return res.status(200).json({ message: "Verified" });
  } else {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }
};

// REGISTER CUSTOMER ON SIGNUP
const RegisterCustomer = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    if (!verifyOTP(email, otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    const userData = getTempUserData(email);
    if (!userData) {
      return res.status(400).json({ message: "User data not found" });
    }
    let imageUrl = null;
    if (userData.imageFilePath) {
      console.log(userData.imageFilePath);
      const result = await cloudinary.uploader.upload(userData.imageFilePath);
      console.log("Secure URL: ", result.secure_url);
      imageUrl = result.url;
      console.log("Image Url is: " + imageUrl);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newCustomer = new Customer({
      firstName: userData.firstName,
      familyName: userData.familyName,
      email: userData.email,
      countryCode: userData.countryCode,
      phoneNumber: userData.phoneNumber,
      password: hashedPassword,
      imageURL: imageUrl,
    });
    await newCustomer.save();
    clearTempUserData(email);

    req.user = newCustomer;
    next();
  } catch (err) {
    next(err);
  }
};

const GetTempData = async (req, res, next) => {
  console.log(tempStore);
  res.status(200).send(tempStore);
};

// SET NEW USER PASSWORD
const NewPassword = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Customer.updateOne({ email }, { password: hashedPassword });
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    return res.status(400).json({ message: "Password not changed" });
  }
};

// LOGIN CUSTOMER
const LoginCustomer = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, customer.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.user = customer;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
};

let tempStore = {};

const saveOTP = (email, otp) => {
  tempStore[email] = { ...tempStore[email], otp };
};

const saveTempUserData = (email, userData) => {
  tempStore[email] = { ...tempStore[email], userData };
};

const getTempUserData = (email) => {
  return tempStore[email]?.userData;
};

const clearTempUserData = (email) => {
  delete tempStore[email];
};

module.exports = {
  GetCustomers,
  GetCustomerByID,
  CreateCustomer,
  UpdateCustomer,
  DeleteCustomer,
  RegisterCustomer,
  LoginCustomer,
  VerifyResetOTP,
  NewPassword,
  RegisterCustomerInitiate,
  OtpEmail,
  GetTempData,
};
