const FarmNote=require('../models/farm-note')
const Task=require('../models/tasks');
const User=require('../models/user');
const Worker=require('../models/workers');


var admin = require('firebase-admin');

// GET ALL FARM-NOTE
const GetFarmNote = async (req, res, next) => {
  console.log("Get all farmNote");
  try {
    const farmNote = await FarmNote.find().populate("farm", "farmName farmType _id").populate("worker","fullName _id");
    return res.status(200).send(farmNote);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE FARM-NOTE
const GetFarmNoteByID = async (req, res, next) => {
  try {
    const farmNote = await FarmNote.findById(req.params.id).populate("farm", "farmName farmType _id").populate("worker","fullName _id");
    return res.status(200).send(farmNote);
  } catch (err) {
    next(err);
  }
};

// GET ALL FARM-NOTE FOR A SPECIFIC USER
const GetUserFarmNote = async (req, res, next) => {
  console.log("Get all user farmNote");
  try {
    const farmNote = await FarmNote.find({ user: req.params.id }).populate("farm", "farmName farmType _id").populate("worker","fullName _id").populate("selfAssignedTo","firstName");
    return res.status(200).send(farmNote);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW FARM-NOTE
const CreateFarmNote = async (req, res, next) => {
  const data=req.body;
  console.log(data,"whole data")
  const farmNote = new FarmNote(req.body);
  try {
    await farmNote.save();
    let workerData;
    if(data.worker){
      console.log("worker exists")
     workerData=data.worker
    }
    const task=new Task({farm:farmNote.farm,noteId:farmNote._id,user:data.user,taskDate:data.taskDate,action:false,taskType:"farmNote",workerId:workerData })
   if(req.body.worker){
     const workerId=req.body.worker
     sendMessage(task,workerId)
    }
    await task.save();
    return res.status(200).json(farmNote);
  } catch (err) {
    next(err);
  }
};
const sendMessage=async(task,workerId)=>{
  console.log(workerId,"IDSSS")
    const worker = await Worker.findById(workerId)
    const tokens=worker.workerToken;
    console.log(tokens,"helppp")

    const message = {
    token:tokens,  // Device token
    data: {
      hello: 'world!',
      taskId: `${task._id}`,
      date:task.taskDate.toLocaleDateString(),
      type: `${task.taskType}`,
      description:`FarmNote has been created By Owner!`,
      taskType:"owner",


    },
    notification: {  // If you want to send a notification as well
      title: 'New Task Available',
      body: `A new task of type ${task.taskType} is available.`
    }
  };
      admin.messaging().send(message).then((response) => {
        console.log(response.successCount + ' messages were sent successfully for task', task._id);
      })
      .catch((error) => {
        console.log('Error sending multicast message for task', task._id, ':', error);
      });
}

const completedMessage=async(task,workerName)=>{
  console.log(task,"task")
  console.log(task.user)
  const owner = await User.findById(task.user)
  console.log(owner)
  
  const tokens = owner.userToken;
    const message = {
    token:tokens,  // Device token
    data: {
      hello: 'world!',
      taskId: `${task._id}`,
      date:task.taskDate.toLocaleDateString(),
      type: `${task.taskType}`,
      description:`FarmNote has been completed by ${workerName ? workerName : task.user.firstName}`,
      taskType:"owner",


    },
    notification: {  // If you want to send a notification as well
      title: 'New Task Available',
      body: `A new task of type ${task.taskType} is available.`
    }
  };
      admin.messaging().send(message).then((response) => {
        console.log(response.successCount + ' messages were sent successfully for task', task._id);
      })
      .catch((error) => {
        console.log('Error sending multicast message for task', task._id, ':', error);
      });
}

// UPDATE FARM-NOTE
const UpdateFarmNote = async (req, res, next) => {
  try {
    const farmNote = await FarmNote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate('worker',"fullName _id");
    const task=await Task.findOneAndUpdate (
  { noteId: farmNote._id },  // This is the filter object to find the document
  { $set: { taskDate: req.body.taskDate,taskType:"farmNote",action:req.body.action,workerId:req.body.worker} },  // This is the update object
  { new: true }  // Options object (note: `new: true` does not apply to `updateOne`)
  )
  await task.populate('user', 'firstName _id');
  await task.save();
  
  completedMessage(task,farmNote?.worker?.fullName);
    return res.status(200).json(farmNote);
  } catch (err) {
    next(err);
  }
};

// DELETE FARM-NOTE
const DeleteFarmNote = async (req, res, next) => {
  try {
    const farmNote = await FarmNote.findByIdAndDelete(req.params.id);
    await Task.deleteOne({noteId:req.params.id});

    return res.status(200).json(farmNote);
  } catch (err) {
    next(err);
  }
};


module.exports={
    GetFarmNote,
    GetFarmNoteByID,
    GetUserFarmNote,
    CreateFarmNote,
    UpdateFarmNote,
    DeleteFarmNote


}