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

var admin = require('firebase-admin');



const upload = multer({ storage: storage });

const UploadFileMulter = upload.single("imageUri");

//        ********** FUNCTIONS ***********

// GET ALL USERS
const GetUsers = async (req, res, next) => {
  console.log(req.token);
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
    console.log(req.body);
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

// USER REGISTRATION
const RegisterUser = async (req, res, next) => {
  const { firstName, familyName, phoneNumber, email, password, country } =
    req.body;

  try {
    const imageURL =
      req.file?.path ||
      "https://res.cloudinary.com/dqnz3rzt5/image/upload/v1679141386/avatar_sofpb7.jpg";

    const hashedPassword = await bcrypt.hash(password, 10);
    const countryObj = JSON.parse(country);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.toObject().otpVerification === null) {
        return res
          .status(409)
          .json({ message: "User with this email already exists" });
      } else {
        existingUser.firstName = firstName;
        existingUser.familyName = familyName;
        existingUser.phoneNumber = phoneNumber;
        existingUser.password = hashedPassword;
        existingUser.imageURL = imageURL;
        existingUser.country = countryObj;
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
        country: countryObj,
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

// RESEND REGISTRATION OTP
const ResendRegistrationOTP = async (req, res, next) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.otpVerification) {
        return res.status(409).json({ message: "User is already verified" });
      } else {
        sendOTPVerification(existingUser, res);
      }
    } else {
      return res.status(500).json({ message: "User does not exist" });
    }
  } catch (err) {
    next(err);
  }
};

// LOGIN USER
const LoginUser = async ( req, res, next) => {
  const { email, password,token } = req.body;

  try {
    
    const user = await User.findOne(
    {email: email }, // query to find the user by email
    // { new: true, runValidators: true } 
    );

    // const userId=user._id;
    // console.log(userId)
    // const newToken = await Device.create({userId, token });
    //   console.log(newToken)

    if (!user) {
      console.log("Invalid Credentials");
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    if (user.otpVerification && user.otpVerification.otp) {
      console.log("Invalid email");
      return res.status(401).json({ message: "Email not verified" });
    }

    console.log("Entered Password: ", password);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("Invalid Password");
      return res.status(401).json({ message: "Invalid Credentials" });
    }
 

// Send messages to our users
  //  await sendMessage(user._id);
    const users=await User.findOneAndUpdate(
    {email: email }, // query to find the user by email
    { $set: { token: token } }, // update operation to set the token
    { new: true, runValidators: true } );
    
    await users.save();

    req.user = users;
    next();
  } catch (err) {
    next(err);
  }
};



   
async function getTokensFromDatastore(userId) {
  try {
    // Assuming your DeviceToken fmodel has a `userId` field
    const tokensData = await User.find({ _id: userId }).exec();
    const tokens = tokensData.map(tokenDoc => tokenDoc.token);
    console.log(tokens)
    return tokens;
  } catch (error) {
    console.error('Failed to fetch tokens from datastore:', error);
    throw error; // Rethrow the error to handle it in the calling context
  }
}
async function sendMessage(userId) {
  // Fetch the tokens from an external datastore (e.g. database)
  const tokens = await getTokensFromDatastore(userId);

  // Send a message to devices with the registered tokens
  const response =await admin.messaging().sendEachForMulticast({
    tokens, // ['token_1', 'token_2', ...]
    data: {  hello: 'world!' },
  });
  console.log("message")
  
  console.log(response)
}
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
        const { expiresAt } = user.reset;
        const hashedOTP = user.reset.otp;

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
              email: user.email,
            });
          }
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

// RESEND REGISTRATION OTP
const ResendResetOTP = async (req, res, next) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.otpVerification) {
        return res.status(409).json({ message: "User is already verified" });
      } else {
        sendResetOTP(existingUser, res);
      }
    } else {
      return res.status(500).json({ message: "User does not exist" });
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
  ResendRegistrationOTP,
  ResendResetOTP,
};
