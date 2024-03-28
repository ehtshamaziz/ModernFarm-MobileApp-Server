const Treatment = require("../models/treatment");
const Task=require("../models/tasks");
const User=require("../models/user");
const Worker=require("../models/workers")



var admin = require('firebase-admin');


// GET ALL TREATMENT           
const GetTreatment = async (req, res, next) => {
  console.log("Get all Treatment");
  try {
    const treatment = await Treatment.find();
    return res.status(200).send(treatment);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE TREATMENT
const GetTreatmentByID = async (req, res, next) => {
  try {
    const treatment = await Treatment.findById(req.params.id);
    return res.status(200).send(treatment);
  } catch (err) {
    next(err);
  }
};

// GET ALL TREATMENT FOR A SPECIFIC USER
const GetUserTreatment = async (req, res, next) => {
  console.log("Get all user Treatment");
  try {
    const treatment = await Treatment.find({ user: req.params.id })
    .populate("diseaseSelection","diseaseName")
    .populate("farm","farmName farmType")
    .populate("medicineSelection", "name")
    .populate("bird","birdId")
    .populate("couple","coupleId")
    
    return res.status(200).send(treatment);
  } catch (err) {
    next(err);
  }
};



// CREATE NEW TREATMENT
const CreateTreatment = async (req, res, next) => {
 
  try {
   const treatment =  new Treatment(req.body);
   await treatment.save();     


  if(treatment.couple && treatment.couple.length){
    await Promise.all(treatment.couple.map(async (element)=>{
      
  for(let p=1; p<=treatment.treatmentRecurrancePeriod;p++){
              const task=new Task({treatmentId: treatment._id,coupleId:element,user:treatment.user,farm:treatment.farm,taskType:'treatment',taskDate:treatment.treatmentStartDate});
              await task.save();
              await sendMessage(task)
          }
        let treatmentStartDate = new Date(treatment.treatmentStartDate);

        for(let i=1; i<=treatment.durationOfTreatment;i++){
          treatmentStartDate.setDate(treatmentStartDate.getDate() + 1);
          for(let j=1; j<=treatment.treatmentRecurrancePeriod;j++){
              const task=new Task({treatmentId: treatment._id,coupleId:element,user:treatment.user,farm:treatment.farm,taskType:'treatment',taskDate:treatmentStartDate});
              await task.save();
              await sendMessage(task)
              treatment.treatmentStartDate = treatmentStartDate;
              await treatment.save();
          }

        }
    }))
  }
  if(treatment.bird && treatment.bird.length){
      await Promise.all(treatment.bird.map(async(element)=>{
       
        for(let p=1; p<=treatment.treatmentRecurrancePeriod;p++){
              const task=new Task({treatmentId: treatment._id,birdId:element,user:treatment.user,farm:treatment.farm,taskType:'treatment',taskDate:treatment.treatmentStartDate});
              await task.save();
              await sendMessage(task)
          }
        let treatmentStartDate = new Date(treatment.treatmentStartDate);

        for(let i=1; i<=treatment.durationOfTreatment;i++){
          treatmentStartDate.setDate(treatmentStartDate.getDate() + 1);
          for(let j=1; j<=treatment.treatmentRecurrancePeriod;j++){
              const task=new Task({treatmentId: treatment._id,birdId:element,user:treatment.user,farm:treatment.farm,taskType:'treatment',taskDate:treatmentStartDate});
              await task.save();
              await sendMessage(task)
              treatment.treatmentStartDate = treatmentStartDate;
              await treatment.save();
          }

        }

   

    })
      )
  }

    // await treatment.save();
    return res.status(200).json(treatment);
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
      {    'notificationRights.medicine': true
},
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


// UPDATE TREATMENT
const UpdateTreatment = async (req, res, next) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    await treatment.save();
    const task =await Task.updateMany(
      {treatmentId:treatment._id},
      { $set:{ treatmentDate:treatment.treatmentStartDate}}
      );

    await task.save();

    return res.status(200).json(treatment);
  } catch (err) {
    next(err);
  }
};

// DELETE TREATMENT
const DeleteTreatment = async (req, res, next) => {
  try {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
     await Task.deleteMany({
      treatmentId: req.params.id

    });
    return res.status(200).json(treatment);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetTreatment,
  GetTreatmentByID,
  CreateTreatment,
  UpdateTreatment,
  DeleteTreatment,
  GetUserTreatment,
};
