const workers = require('../models/workers');
const Worker=require('../models/workers')
const { sendWorkerOTPVerification, sendResetOTP } = require("../utils/otp");
const bcrypt = require("bcrypt");


// GET ALL WORKERS
const GetWorkers = async (req, res, next) => {
  console.log("Get all workers");
  try {
    const workers = await Worker.find()
    .populate({
      path:"farm",
      select:"farmName user",
      populate:{
        path:"user",
        select:"firstName lastName"
      }

    });
    return res.status(200).send(workers);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE WORKERS
const GetWorkersByID = async (req, res, next) => {
  try {
    const workers = await Worker.findById(req.params.id);
    return res.status(200).send(workers);
  } catch (err) {
    next(err);
  }
};

// GET ALL WORKERS FOR A SPECIFIC USER
const GetUserWorkers = async (req, res, next) => {
  console.log("Get all user workers");
  try {
    const workers = await Worker.find({ user: req.params.id })
    .populate({
      path: 'farm',
      select: 'farmName farmType'

    });
    console.log(workers)
    return res.status(200).send(workers);
  } catch (err) {
    next(err);
  }
};


// CREATE NEW WORKERS
const CreateWorkers = async (req, res, next) => {
  const workers = new Worker(req.body);
  try {
    sendWorkerOTPVerification(workers, res);

    // return res.status(200).json(workers);

  } catch (err) {
    next(err);
  }
};

const VerifyWorker = async (req, res, next) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) {
      throw new Error("Empty OTP or User Details.");
    } else {
      const user = await Worker.findOne({email:email});
    console.log(user)
    user.otpVerified=true;
    await user.save()
    console.log("userssss")
      if (!user.otpVerification || !user.otpVerification.otp) {
        throw new Error("No OTP Details. Please try again.");
      } else {
        const hashedOTP = user.otpVerification.otp;

   
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            throw new Error("Invalid OTP.");
          } else {

            req.user = user;
            next();
            // res.status(200).json(user);
          }
        
      }
    }
  } catch (err) {
    next(err);
  }
};


// UPDATE WORKERS
const UpdateWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(workers);
  } catch (err) {
    next(err);
  }
};


// UPDATE MULTIPLE WORKERS
// Assuming you receive an array of IDs and the updates in your request body
// req.body = { ids: ['id1', 'id2'], notificationRights: { ... } }

// const UpdateMultipleWorkers = async (req, res, next) => {
//   try {
//     const { ids, notificationRights } = req.body;

//     const result = await Worker.updateMany(
//       { _id: { $in: ids } },
//       { $set: { notificationRights: notificationRights } }
//     );

//     return res.status(200).json(result);
//   } catch (err) {
//     next(err);
//   }
// };



// DELETE WORKERS
const DeleteWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.findByIdAndDelete(req.params.id);
    return res.status(200).json(workers);
  } catch (err) {
    next(err);
  }
};


// LOGIN WORKER
const LoginWorker = async (req, res, next) => {
  console.log("Workerss")
  const { email, password,token } = req.body;
  console.log(token);
  
  
  console.log(email)
  try {
    const worker = await Worker.findOne(
      {
        email:email,
        otpVerified:false
    }
    )
    if(worker){
      return res.status(201).json({message:"OTP not verified"})
    }

    const user = await Worker.findOneAndUpdate(
    {email: email }, // query to find the user by email
    { $set: { workerToken: token } }, // update operation to set the token
    { new: true, runValidators: true } );
    // console.log(user)
    // const userId=user._id;
    // console.log(userId)
    // await Device.create({userId, token });
    if (!user) {
      console.log("Invalid Credentials");
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // console.log("Entered Password: ", password);
    // const passwordMatch = await bcrypt.compare(password, worker.password);
    if (!password) {
      console.log("Invalid Password");
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};


module.exports={
    LoginWorker,
    GetWorkers,
    VerifyWorker,
    GetWorkersByID,
    GetUserWorkers,
    CreateWorkers,
    UpdateWorkers,
    DeleteWorkers


}