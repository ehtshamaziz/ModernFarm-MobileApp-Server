const Clutch = require("../models/clutch");
const Egg = require("../models/egg");
const Task=require('../models/tasks');
const User=require("../models/user");
const Worker= require("../models/workers");

var admin = require('firebase-admin');




const GetEggs = async (req, res, next) => {
  console.log("Get all eggs");
  try {
    const egg = await Egg.find();
    return res.status(200).send(egg);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE BIRD
const GetEggsByID = async (req, res, next) => {
  try {
    const egg = await Egg.findById(req.params.id);
    return res.status(200).send(egg);
  } catch (err) {
    next(err);
  }
};

// GET ALL BIRD FOR A SPECIFIC USER
const GetUserEggs = async (req, res, next) => {
  console.log("Get all user egg");
  try {
    const egg = await Egg.find({ clutch: req.params.id })
    .populate("clutch","incubationStartDate")
    .populate("lastTransferID","coupleId")
    .populate("birdID")
    .populate({
      path:"parentCouple",
      select:"coupleId specie",
      populate:{
        path:"specie",
        select:"incubation startFeedingAfter addRingAfter fertilityDays"
      }
    })
    console.log("peeepeepepeps")
    console.log(egg)
    return res.status(200).send(egg);
  } catch (err) {
    console.log("Not Found ");
    next(err);
  }
};

// GET ALL THE EGGS OF A COUPLE
const GetCouplesEggs = async (req,res,next)=>{
  //console.log(req.body);
    try {
    const clutch = await Clutch.find({couple: req.params.id})  
    console.log(clutch)
    const eggs=await Promise.all(
      clutch.map((clutch)=>
      Egg.find({
        clutch :clutch._id
      }))
    )
    return res.status(200).send(eggs);
  } catch (err) {
    console.log("Not Found ");
    next(err);
  }
}

  const GetParentCouplesEggs = async (req,res,next)=>{
  //console.log(req.body);
    try {
    const eggs = await Egg.find({parentCouple: req.params.id})  
    
    return res.status(200).send(eggs);
  } catch (err) {
    console.log("Not Found ");
    next(err);
  }
}


function addDaysToDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// CREATE NEW EGG
const AddEggs = async (req, res, next) => {
  try {
    const { clutch } = req.body;
    const {eggsLaidDate} = req.body;


    const highestEgg = await Egg.findOne({ clutch: clutch }).sort({
      eggNumber: -1,
    });
    const eggNumber = highestEgg
      ? (parseInt(highestEgg.eggNumber) + 1).toString().padStart(3, "0")
      : "001";
    const egg = new Egg({ ...req.body, eggNumber });
    await egg.save();

      const clutches = await Clutch.findById({_id:clutch})
  .populate({
      path:"couple",
      select:"coupleId specie cageNumber user farm",
  });

     const task=new Task({eggId: egg._id,user:clutches.couple.user,farm:clutches.couple.farm,taskType:'fertility'});
    const task2=new Task({eggId: egg._id,user:clutches.couple.user,farm:clutches.couple.farm,taskType:'hatching'});
     await task.save();
     await task2.save();

       await sendMessage(task);
       await sendMessage(task2);

      //  await sendMessage(task);

      //  const workers=Worker({});


//   const clutches = await Clutch.findById({_id:clutch})
//   .populate({
//       path:"couple",
//       select:"coupleId specie cageNumber user farm",
//       populate:{
//         path:"specie",
//         select:"incubation startFeedingAfter addRingAfter fertilityDays"
//       }
//     })
//     // Extract the incubationStartDate from the query result

//     const earlyFeedingDays = clutches.couple.specie.startFeedingAfter;
//     const fertilityDays = clutches.couple.specie.fertilityDays;
//     const incubationDays = clutches.couple.specie.incubation;
//     const addRingAfterDays = clutches.couple.specie.addRingAfter;
//     const clutchNumber = clutches.clutchNumber;
//     const coupleId=clutches.couple.coupleId;
//     const cageNumber=clutches.couple.cageNumber;
//     const user=clutches.couple.user;

//     const farm=clutches.couple.farm;
//     console.log("farm")
//     console.log(farm);
//     console.log(user);

// // Convert string date to Date object if necessary
//     const eggsLaidDateObj = new Date(eggsLaidDate);

// // Calculate the dates by adding days to eggsLaidDate
//     const earlyFeedingDate = addDaysToDate(eggsLaidDateObj, earlyFeedingDays);
//     const fertilityVerificationDate = addDaysToDate(eggsLaidDateObj, fertilityDays);
//     const hatchingDate = addDaysToDate(eggsLaidDateObj, incubationDays);
//     const ringAddingDate = addDaysToDate(eggsLaidDateObj, addRingAfterDays);


//     const task=new Task({eggId: egg._id,fertilityDate:fertilityVerificationDate,hatchingDate:hatchingDate,birdRecordDate:ringAddingDate,earlyFeedingDate:earlyFeedingDate, eggLaidDate:eggsLaidDateObj, clutchNumber:clutchNumber, coupleId:coupleId, cageNumber:cageNumber,user:user, farm:farm});
//     await task.save()
    return res.status(200).json(egg);
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

   async function sendMessage(task) {
  // Fetch workers who are eligible for fertilityTest notifications
  const workers = await Worker.find({
    farm: task.farm,
    $or:[
      {    'notificationRights.fertilityTest': true
},
      {    'notificationRights.hatching': true
}
    ]
  }).exec(); // Make sure to await the query

  console.log("ssssssssdddddfffff")
  console.log(workers)
  // For each worker, fetch their device token and send a notification
  for (const worker of workers) {
    const tokens = await getTokensFromDatastore(worker._id); // Assuming worker.userId exists and corresponds to userId in Device

    console.log("Tokensss");
    console.log(tokens)
    if (tokens.length > 0) {
      console.log("Sending message to", worker._id);
      const response = await admin.messaging().sendMulticast({
        tokens, // Array of device tokens
        data: { hello: 'world!' }, // Your data payload
      });
      console.log(response); // Log the response from sending the message
    }
  }
}

// UPDATE BIRD
const UpdateEgg = async (req, res, next) => {
  try {
    const egg = await Egg.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(egg);
  } catch (err) {
    next(err);
  }
};

// DELETE BIRD
const DeleteEgg = async (req, res, next) => {
  try {
    const egg = await Egg.findByIdAndDelete(req.params.id);

   await Task.deleteMany({
      eggId: req.params.id

    });
    return res.status(200).json(egg);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetEggs,
  GetEggsByID,
  AddEggs,
  GetUserEggs,
  UpdateEgg,
  DeleteEgg,
  GetParentCouplesEggs,
  GetCouplesEggs,

};
