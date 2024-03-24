const Nutrition = require("../models/nutrition");
const Task =require("../models/tasks");
const User=require("../models/user");
const Worker=require("../models/workers")



var admin = require('firebase-admin');

// GET ALL NUTRITION
const GetNutritions = async (req, res, next) => {
  console.log("Get all farms");
  try {
    const nutrition = await Nutrition.find();
    return res.status(200).send(nutrition);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE NUTRITION
const GetNutritionsByID = async (req, res, next) => {
  try {
    const nutrition = await Nutrition.findById(req.params.id);
    return res.status(200).send(nutrition);
  } catch (err) {
    next(err);
  }
};

// GET ALL NUTRITION FOR A SPECIFIC USER
const GetUserNutritions = async (req, res, next) => {
  console.log("Get all user nutritions");
  try {
    const nutrition = await Nutrition.find({ user: req.params.id });
    nutrition.save();

    return res.status(200).send(nutrition);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW NUTRITION
const CreateNutritions = async (req, res, next) => {
  const nutrition = new Nutrition(req.body);
  try {
    await nutrition.save();
    
  if(nutrition.couple && nutrition.couple.length){
    await Promise.all(nutrition.couple.map(async (element)=>{


    const task=new Task({nutritionDate:nutrition.nutritionDate,nutritionId: nutrition._id,coupleId:element,user:nutrition.user,farm:nutrition.farm,taskType:'nutrition'});
    await task.save();
    sendMessage(task)

    }))
  }
  if(nutrition.bird && nutrition.bird.length){
    await Promise.all(nutrition.bird.map(async(element)=>{

      console.log(nutrition.bird.length)
      console.log("birdssssssssss nutrition")

    const task=new Task({nutritionDate:nutrition.nutritionDate,nutritionId: nutrition._id,birdId:element,user:nutrition.user,farm:nutrition.farm,taskType:'nutrition'});
    await task.save();
    sendMessage(task)

    })
      )
  }
    return res.status(200).json(nutrition);
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
      {    'notificationRights.nutrition': true
},
    ]
  }).exec(); // Make sure to await the query

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



// UPDATE NUTRITION
const UpdateNutritions = async (req, res, next) => {
  try {
    const nutrition = await Nutrition.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(nutrition);
  } catch (err) {
    next(err);
  }
};

// DELETE NUTRITION
const DeleteNutritions = async (req, res, next) => {
  try {
    const nutrition = await Nutrition.findByIdAndDelete(req.params.id);
     await Task.deleteMany({
      nutritionId: req.params.id
    });
    return res.status(200).json(nutrition);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetNutritions,
  GetNutritionsByID,
  CreateNutritions,
  UpdateNutritions,
  DeleteNutritions,
  GetUserNutritions,
};
