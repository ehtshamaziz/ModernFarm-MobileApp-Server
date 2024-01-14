const Customer = require("../models/customer");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
require("dotenv").config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET, 
});

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
//        ********** STRATEGIES ***********

// CUSTOMER GOOGLE STRATEGY
// passport.use(
//   "google-customer",
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/customer/login/google/dashboard",
//     },
//     async function (accessToken, refreshToken, profile, done) {
//       console.log(profile);
//       try {
//         const customer = await Customer.findOne({ googleId: profile.id });
//         if (!customer) {
//           const newCustomer = new Customer({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             imageURL: profile.photos[0].value,
//           });
//           await newCustomer.save();
//           console.log("New customer has been created");
//           return done(null, newCustomer);
//         } else {
//           console.log("Customer already exists");
//           return done(null, customer);
//         }
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

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

const sendOTPEmail = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'gunslinger2136@gmail.com', 
            pass: 'vmwj rosv tytp wmpl', 
        },
    });

    let mailOptions = {
        from: 'gunslinger2136@gmail.com',
        to: email,
        subject: 'Your OTP',
        text: `Your OTP is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// 
const OptEmail=async(req,res,next)=>{
    const { email } = req.body;
  


    try{
        const existingCustomer = await Customer.findOne({ email: email });
        if (existingCustomer) {
           const otp = generateOTP(); // Implement this function to generate an OTP
    saveOTP(email, otp); // Implement this function to save OTP temporarily
    sendOTPEmail(email, otp); // Implement this function to send OTP via email
    // Temporarily save user data (except password) with the OTP
    res.status(200).json({ message: 'OTP sent to email' });
        } else {
          return res.status(409).json({ message: "Email Not registered." });

          }  
    
    }
    catch(err){
      next("Error is: "+err);
    }
}


// 
const RegisterCustomerInitiate=async(req,res,next)=>{
    const { firstName, familyName, phoneNumber, countryCode, email, password} = req.body;

      const imageFile = req.file; 
       const imageFilePath = imageFile ? imageFile.path : null;
      console.error(imageFile);
    try{
        const existingCustomer = await Customer.findOne({ email: email });
        if (existingCustomer) {
            return res.status(409).json({ message: "Email already in use" });
        }
      const otp = generateOTP(); // Implement this function to generate an OTP
    saveOTP(email, otp); // Implement this function to save OTP temporarily
    sendOTPEmail(email, otp); // Implement this function to send OTP via email

    saveTempUserData(email, { firstName, familyName,phoneNumber,countryCode, email,password,imageFilePath }); // Implement this
    res.status(200).json({ message: 'OTP sent to email' });
    }
    catch(err){
      next("Error is: "+err);
    }
}
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
const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
// 4 digit OTP
  return otp.toString();
};
const verifyOTP = (email, otp) => {
    // Retrieve the stored OTP for the given email
    const storedData = tempStore[email];

    // Check if there is stored data and if the OTP matches
    if (storedData && storedData.otp === otp) {
    
        return true;
    } else {

        return false;
    }
};
const VerifyResetOTP = (req, res, next) => {
    // Retrieve the stored OTP for the given email
    const { email, otp } = req.body;
    console.log("Reset Password: "+otp);
    const storedData = tempStore[email];

    // Check if there is stored data and if the OTP matches
    if (storedData && storedData.otp === otp) {
        // If the OTP matches, return true
                return res.status(200).json({ message: 'Verified' });
    } else {
        // If there is no data or the OTP doesn't match, return false
           return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
};



// REGISTER CUSTOMER ON SIGNUP
const RegisterCustomer = async (req, res, next) => {
const { email, otp } = req.body;
  


try{
    if (!verifyOTP(email, otp)) { 
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    // Retrieve temporarily saved user data
    const userData = getTempUserData(email); // Implement this
    if (!userData) {
        return res.status(400).json({ message: 'User data not found' });
    }
  // const profilePicUrl = await uploadProfilePicture(profilePicData);
 let imageUrl = null;
    if (userData.imageFilePath) {
      console.log(userData.imageFilePath);
        const result = await cloudinary.uploader.upload(userData.imageFilePath);
        
        imageUrl = result.url;
        console.log("Image Url is: "+imageUrl);
    }



    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newCustomer = new Customer({ 
            firstName: userData.firstName,
            familyName: userData.familyName,
            email: userData.email,
            countryCode: userData.countryCode,
            phoneNumber: userData.phoneNumber,
            password: hashedPassword,
            imageURL:imageUrl,

    });
    await newCustomer.save();
    // Clear the temporary data
    clearTempUserData(email); 
    res.status(201).json({ message: 'User registered successfully' });

  }
  catch(err){
      next(err);
  }

};


// 
const NewPassword=async(req,res,next)=>{
  const{password,email}=req.body;
  try{

    const hashedPassword = await bcrypt.hash(password, 10);

        // Find user and update password
        await Customer.updateOne({ email }, { password: hashedPassword });


        res.status(200).json({ message: 'Password has been reset successfully' });
  }
  catch(err){
          return res.status(400).json({ message: 'Password not changed' });

  }

}







// 



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

// TEST FUNCTION
const ProtectedRoute = async (req, res) => {
  console.log(req.user);
  res.status(200).json(req.user);
};

// // GOOGLE AUTHENTICATION
// const GoogleAuthenticate = passport.authenticate("google-customer", {
//   scope: ["profile", "email"],
// });

// // GOOGLE AUTHENTICATION REDIRECT
// const GoogleAuthenticateRedirect = passport.authenticate("google-customer", {
//   failureRedirect: "http://localhost:5173/customer/login",
// });

// // GOOGLE AUTHENTICATION SUCCESS REDIRECT
// const GoogleAuthenticated = (req, res) => {
//   res.redirect(
//     `http://localhost:5173/customer/login?id=${req.user._id}&name=${req.user.name}&email=${req.user.email}&imageURL=${req.user.imageURL}`
//   );
// };

exports.GetCustomers = GetCustomers;
exports.GetCustomerByID = GetCustomerByID;
exports.CreateCustomer = CreateCustomer;
exports.UpdateCustomer = UpdateCustomer;
exports.DeleteCustomer = DeleteCustomer;

exports.RegisterCustomer = RegisterCustomer;
exports.LoginCustomer = LoginCustomer;
exports.VerifyResetOTP = VerifyResetOTP;
exports.NewPassword = NewPassword;




exports.RegisterCustomerInitiate=RegisterCustomerInitiate;
exports.ProtectedRoute = ProtectedRoute;
exports.OptEmail=OptEmail;

// exports.GoogleAuthenticate = GoogleAuthenticate;
// exports.GoogleAuthenticateRedirect = GoogleAuthenticateRedirect;
// exports.GoogleAuthenticated = GoogleAuthenticated;
