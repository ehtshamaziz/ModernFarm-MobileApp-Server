const User = require("../models/user");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { sendOTPVerification, sendResetOTP } = require("../utils/otp");
const multer = require("multer");

// SETUP CLOUDINARY STORAGE WITH MULTER
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ModernFarm",
    format: async (req, file) => "jpg",
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

const UploadFileMulter = upload.single("imageUri");

//        ********** FUNCTIONS ***********

// GET ALL USERS
const GetUsers = async (req, res, next) => {
  console.log("Get all users");
  try {
    const user = await User.find();
    return res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE USER
const GetUserByID = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW USER
const CreateUser = async (req, res, next) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// UPDATE USER
const UpdateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// DELETE USER
const DeleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// // INITIATE USER REGISTRATION ON SIGNUP AND SEND OTP
// const RegisterUserInitiate = async (req, res, next) => {
//   const { firstName, familyName, phoneNumber, countryCode, email, password } =
//     req.body;

//   const imageFile = req.file;
//   const imageFilePath = imageFile ? imageFile.path : null;
//   console.error(imageFile);

//   try {
//     const existingUser = await User.findOne({ email: email });
//     if (existingUser) {
//       return res.status(409).json({ message: "Email already in use" });
//     }
//     const otp = generateOTP();
//     saveOTP(email, otp);
//     await sendOTP(email, otp);

//     saveTempUserData(email, {
//       firstName,
//       familyName,
//       phoneNumber,
//       countryCode,
//       email,
//       password,
//       imageFilePath,
//     });
//     res.status(200).json({ message: "OTP sent to email" });
//   } catch (err) {
//     next("Error is: " + err);
//   }
// };

// USER REGISTRATION
const RegisterUser = async (req, res, next) => {
  const { firstName, familyName, phoneNumber, email, password } = req.body;

  try {
    const imageURL =
      req.file.path ||
      "https://res.cloudinary.com/dqnz3rzt5/image/upload/v1679141386/avatar_sofpb7.jpg";
    console.log("Image URL: ", imageURL);
    console.log("Req File URL: ", req.file.path);

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.otpVerification) {
        return res
          .status(409)
          .json({ message: "User with this email already exists" });
      } else {
        existingUser.firstName = firstName;
        existingUser.familyName = familyName;
        existingUser.phoneNumber = phoneNumber;
        existingUser.password = hashedPassword;
        existingUser.imageURL = imageURL;
        sendOTPVerification(existingUser, res);
      }
    } else {
      const newUser = new User({
        firstName,
        familyName,
        phoneNumber,
        email,
        password: hashedPassword,
        imageURL,
      });
      sendOTPVerification(newUser, res);
    }
  } catch (err) {
    next(err);
  }
};

// VERIFY USER OTP AND COMPLETE REGISTRATION
const VerifyOTP = async (req, res, next) => {
  try {
    let { userId, otp } = req.body;
    if (!userId || !otp) {
      throw new Error("Empty OTP or User Details.");
    } else {
      const user = await User.findById(userId);
      if (!user.otpVerification || !user.otpVerification.otp) {
        throw new Error("No OTP Details. Please try again.");
      } else {
        const { expiresAt } = user.otpVerification;
        const hashedOTP = user.otpVerification.otp;

        if (expiresAt < Date.now()) {
          throw new Error("OTP has expired. Please request again.");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            throw new Error("Invalid OTP.");
          } else {
            user.otpVerification = null;
            await user.save();
            req.user = user;
            next();
          }
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

// LOGIN USER
const LoginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    if (user.otpVerification && user.otpVerification.otp) {
      return res.status(401).json({ message: "Email not verified" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// SEND PASSWORD RESET OTP TO USER
const RequestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    sendResetOTP(user, res);
  } catch (error) {
    return res.status(500).json({ message: "Error requesting password reset" });
  }
};

// VERIFY PASSWORD RESET OTP
const VerifyResetOTP = async (req, res, next) => {
  try {
    let { userId, otp } = req.body;
    if (!userId || !otp) {
      throw new Error("Empty OTP or User Details.");
    } else {
      const user = await User.findById(userId);
      if (!user.reset || !user.reset.otp) {
        throw new Error("No OTP Details. Please try again.");
      } else {
        const { expiresAt } = user.otpVerification;
        const hashedOTP = user.otpVerification.otp;

        if (expiresAt < Date.now()) {
          throw new Error("OTP has expired. Please request again.");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            throw new Error("Invalid OTP.");
          } else {
            user.reset = null;
            await user.save();
            return res.status(200).json({
              message: `OTP successfully verified`,
              userId: userId,
            });
          }
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

// SET NEW USER PASSWORD
const NewPassword = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { password: hashedPassword });
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (err) {
    return res.status(400).json({ message: "Password not changed" });
  }
};

module.exports = {
  GetUsers,
  GetUserByID,
  CreateUser,
  UpdateUser,
  DeleteUser,
  // RegisterUser,
  LoginUser,
  // VerifyResetOTP,
  NewPassword,
  RegisterUser,
  // OtpEmail,
  // GetTempData,
  UploadFileMulter,
  VerifyOTP,
  RequestPasswordReset,
  VerifyResetOTP,
};
