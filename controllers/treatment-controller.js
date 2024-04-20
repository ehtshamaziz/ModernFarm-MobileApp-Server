const Treatment = require("../models/treatment");
const Task=require("../models/tasks");
const User=require("../models/user");
const Worker=require("../models/workers")
const {sendCronNotification}=require('../utils/sendNotification');

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

   console.log(req.body)

  if(treatment.couple && treatment.couple.length>0){
    await Promise.all(treatment.couple.map(async (element)=>{
      
  // for(let p=1; p<=treatment.treatmentRecurrancePeriod;p++){
  //             const task=new Task({treatmentId: treatment._id,coupleId:element,user:treatment.user,farm:treatment.farm,taskType:'treatment',taskDate:treatment.treatmentStartDate});
  //             await task.save();
  //         }
        let treatmentStartDate = new Date(treatment.treatmentStartDate);

        for(let i=0; i<treatment.durationOfTreatment;i++){
          treatmentStartDate.setDate(treatmentStartDate.getDate() + i);
          for(let j=1; j<=treatment.treatmentRecurrancePeriod;j++){
              const task=new Task({treatmentId: treatment._id,coupleId:element,user:treatment.user,farm:treatment.farm,taskType:'medicalCareTask',taskDate:treatmentStartDate});
              await task.save();
              const startOfToday = new Date();
              startOfToday.setMinutes(startOfToday.getMinutes() - treatment.timezoneOffset);
              startOfToday.setHours(0, 0, 0, 0);
              const startOfTaskDate = new Date(task.taskDate);
              startOfTaskDate.setMinutes(startOfTaskDate.getMinutes() - treatment.timezoneOffset);
              startOfTaskDate.setHours(0, 0, 0, 0);
    
              if(startOfTaskDate <=startOfToday){
                 await notificationEndpoint(req.body.user,task);
              }

              // treatment.treatmentStartDate = treatmentStartDate;
              // await treatment.save();
          }

        }
    }))
  }
  if(treatment.bird && treatment.bird.length>0){
      await Promise.all(treatment.bird.map(async(element)=>{
       
        // for(let p=1; p<=treatment.treatmentRecurrancePeriod;p++){
        //       const task=new Task({treatmentId: treatment._id,birdId:element,user:treatment.user,farm:treatment.farm,taskType:'treatment',taskDate:treatment.treatmentStartDate});
        //       await task.save();
        //   }
        let treatmentStartDate = new Date(treatment.treatmentStartDate);

        for(let i=0; i<treatment.durationOfTreatment;i++){
          treatmentStartDate.setDate(treatmentStartDate.getDate() + i);
          for(let j=1; j<=treatment.treatmentRecurrancePeriod;j++){
              const task=new Task({treatmentId: treatment._id,birdId:element,user:treatment.user,farm:treatment.farm,taskType:'medicalCareTask',taskDate:treatmentStartDate});
              await task.save();
           const startOfToday = new Date();
           startOfToday.setMinutes(startOfToday.getMinutes() - treatment.timezoneOffset);
           startOfToday.setHours(0, 0, 0, 0);
           const startOfTaskDate = new Date(task.taskDate);
           startOfTaskDate.setMinutes(startOfTaskDate.getMinutes() - treatment.timezoneOffset);
           startOfTaskDate.setHours(0, 0, 0, 0);
    
              if(startOfTaskDate <=startOfToday){
                  await notificationEndpoint(req.body.user,task);
              }

              // treatment.treatmentStartDate = treatmentStartDate;
              // await treatment.save();
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



async function notificationEndpoint(user,task){
  const workers=await Worker.find({user:user._id});
  const users=await User.findById(user._id);

  await sendCronNotification(users.userToken,task)


  for(const worker of workers){

    if(worker.accessRights[task.taskType] && worker.workerToken){
      await sendCronNotification(worker.workerToken,task)
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

const GetError=async (req,res,next)=>{
  try{
    console.log("BBBBBBBBBB")
    console.log(req.body)
  }catch(error){
    console.log(error)
  }
}

module.exports = {
  GetTreatment,
  GetTreatmentByID,
  CreateTreatment,
  UpdateTreatment,
  DeleteTreatment,
  GetUserTreatment,
  GetError
};
