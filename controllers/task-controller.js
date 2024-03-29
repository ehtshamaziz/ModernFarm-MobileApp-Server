const Tasks=require('../models/tasks')
const Egg=require("../models/egg")
const User=require("../models/user");
const Worker=require("../models/workers");



var admin = require('firebase-admin');


// GET ALL TASKS
const GetTasks = async (req, res, next) => {
  console.log("Get all Tasks");
  try {
    const tasks = await Tasks.find();
    return res.status(200).send(tasks);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE TASKS
const GetTasksByID = async (req, res, next) => {
  try {
    const tasks = await Tasks.findById(req.params.id);
    return res.status(200).send(tasks);
  } catch (err) {
    next(err);
  }
};

// GET ALL TASKS FOR A SPECIFIC USER
const GetUserTasks = async (req, res, next) => {
  console.log("Get all user Tasks");
  try {

    let tasks;

  if(req.query.birdTasks==='true'){
     tasks = await Tasks.find({ user: req.params.id ,
            eggBirdId: { $exists: true, $ne: null } // This condition checks for tasks where birdId exists and is not null.
})
    .populate({
    path: "eggBirdId",
    select: "birdId birdSpecie birdName eggID cageNumber farm birdId gender birthDate exactBirthDate status source price imageURL couple ringNumber ",
     populate: [
    {
      path: "eggID",
      select: "clutch eggNumber eggsLaidDate",
      populate: {
        path: "clutch",
        select: "couple clutchNumber",
        populate: {
        path: "couple",
        select: "coupleId specie",
        populate: {
          path: "specie",
          select: "addRingAfter incubation addRingAfter startFeedingAfter"
        }
      }
      }
    },
    {
      path: "farm", 
      select: "farmName _id farmType" 
    },
       {
      path: "birdSpecie", 
      select: "_id name specieType" 
    },
      {
      path: "couple", 
      select: "_id coupleId" 
    }
  ]
    // populate:{
    //   path: "eggID",
    //   select: "clutch eggNumber eggsLaidDate",
    // populate: {
    //   path: "clutch",
    //   select: "couple clutchNumber",
    //   populate: {
    //     path: "couple",
    //     select: "coupleId specie",
    //     populate: {
    //       path: "specie",
    //       select: "addRingAfter incubation addRingAfter startFeedingAfter"
    //     }
    //   }
    // }
    // }
  })
  .populate({
    path: "eggBirdId.farm",
    select: "_id farmType farmName"
  });
  console.log(tasks)
  }
  else if(req.query.medicalTasks==='true'){
  console.log("Medical task");
  tasks = await Tasks.find({ user: req.params.id ,
              $or: [
      { treatmentId: { $exists: true, $ne: null } },
      { birdId: { $exists: true, $ne: null } },
      { coupleId: { $exists: true, $ne: null } }
    ]
 // This condition checks for tasks where birdId exists and is not null.
})

for (let task of tasks) {
  // Initialize an array to hold populate options
  const populateOptions = [];
  
  // Check if treatmentId exists and push its populate option
  if (task.treatmentId) {
    populateOptions.push({
      path: 'treatmentId',
      select: 'treatmentStartDate treatmentName',
      // Add more populate options here if needed
    });

    if (task.birdId) {
    populateOptions.push({
      path: 'birdId',
      // Specify select fields if needed, e.g., 'name age'
    });
  }

  // Check if coupleId exists and push its populate option
  if (task.coupleId) {
    populateOptions.push({
      path: 'coupleId',
      // Specify select fields if needed
    });
  }
  }


  if (populateOptions.length > 0) {
  console.log("Medical task222");

    await Tasks.populate(task, populateOptions);
  }
}


  }
  else if(req.query.nutritionTasks==='true'){
  console.log("Nutrition task");
  tasks = await Tasks.find({ user: req.params.id ,
              $or: [
      { nutritionId: { $exists: true, $ne: null } },
      // { birdId: { $exists: true, $ne: null } },
      // { coupleId: { $exists: true, $ne: null } }
    ]
 // This condition checks for tasks where birdId exists and is not null.
})
console.log(tasks);

for (let task of tasks) {
 
  // Initialize an array to hold populate options
  const populateOptions = [];
  
  // Check if treatmentId exists and push its populate option
  if (task.nutritionId) {
  console.log("b")

    populateOptions.push({
      path: 'nutritionId',
      // select: 'Date mealType',
      // Add more populate options here if needed
    });

    if (task.birdId) {
    populateOptions.push({
      path: 'birdId',
      // Specify select fields if needed, e.g., 'name age'
    });
  }

  // Check if coupleId exists and push its populate option
  if (task.coupleId) {
    populateOptions.push({
      path: 'coupleId',
      // Specify select fields if needed
    });
  }
  }


  if (populateOptions.length > 0) {

    await Tasks.populate(task, populateOptions);
    console.log(task);
  }
}


  }
  
  else  if(req.query.eggTasks==='true'){
     tasks = await Tasks.find({ user: req.params.id,
              $or: [
      { eggId: { $exists: true, $ne: null } }],} )
    .populate({
    path: "eggId",
    select: "clutch eggsLaidDate status eggNumber",
    populate: {
      path: "clutch",
      select: "incubationStartDate couple clutchNumber",
      populate: {
        path: "couple",
        select: "coupleId cageNumber specie",
        populate: {
          path: "specie",
          select: "fertilityDays incubation addRingAfter startFeedingAfter"
        }
      }
    }
  });

  }else{
      tasks = await Tasks.find({ user: req.params.id})


  }
    
    // if (req.query.hatching === 'true') {
    //   const hatchingDates = tasks.map(task => task.hatchingDate);
    //   return res.status(200).send(hatchingDates);
    // }
    return res.status(200).send(tasks);
  } catch (err) {
    next(err);
  }
};

const SendNotification=async (req,res,next)=>{
    
  // const tasks = new Tasks(req.body);

  console.log("helppp")

  try{
    const currentDate = new Date();
    // currentDate.setHours(0, 0, 0, 0);
     
     const tasks = await Tasks.find({ user: req.params.id, action:false,taskDate: { $lte: currentDate }})
      console.log(tasks);
      if(tasks.length>=0){
      await sendAllMessage(tasks);

      }

  }catch(error){
    console.log(error)
  }
}

// CREATE NEW TASKS
const CreateTasks = async (req, res, next) => {
  const tasks = new Tasks(req.body);
  try {
    await tasks.save();
    return res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

// UPDATE TASKS
const UpdateTasks = async (req, res, next) => {
  try {
    const tasks = await Tasks.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    await sendMessage(tasks);
    return res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};




async function getTokensFromDatastore(userId,task) {
  try {
    // Assuming your DeviceToken fmodel has a `userId` field
    const worker = await Worker.findOneAndUpdate( {_id: userId} ,{$push:{notifications:task}},{ new: true }
).exec();
    const tokens = worker.token;
    console.log(tokens)
    return tokens;
  } catch (error) {
    console.error('Failed to fetch tokens from datastore:', error);
    throw error; // Rethrow the error to handle it in the calling context
  }
}


   async function sendAllMessage(tasks) {

      for (const task of tasks) {
        console.log(task.farm);

        const workers = await Worker.find({
            farm: task.farm,
            $or: [
                {'notificationRights.medicine': true},
                {'notificationRights.fertilityTest': true},
                {'notificationRights.hatching': true},
                {'notificationRights.externalFeeding': true},
                {'notificationRights.ringNumber': true},
                {'notificationRights.nutrition': true},
            ]
        });

        console.log("Workers found for task:", workers);

        for (const worker of workers) {
            const tokens = await getTokensFromDatastore(worker._id, task); // Assuming getTokensFromDatastore returns tokens array

            console.log("Tokens for worker", worker._id, tokens);

            if (tokens && tokens.length > 0){
                console.log("Sending message for task", task._id, "to worker", worker._id);
                 admin.messaging().send({
                    token:tokens, // Array of device tokens
                    data: {
                        hello: 'world!', // Customize your message payload as needed
                        taskId: `${task._id}`, 
                        type:`${task.taskType}`,
                        workerName:`${worker.fullName}`
                        // Example of including task-specific data
                    },
                })
                .then((response) => {
                    console.log(' messages were sent successfully for task', task._id);
                })
                .catch((error) => {
                    console.log('Error sending multicast message for task', task._id, ':', error);
                });
            }
        }
    }
}



   async function sendMessage(task) {
  // Fetch workers who are eligible for fertilityTest notifications
  const owner = await User.findById(task.user)

  console.log("owners")
  console.log(owner);
  const tokens =  owner.token;
  console.log(tokens)

  if (tokens) {
      console.log("Sending message to",owner.firstName);
       const message = {
    token:tokens,  // Device token
    data: {
      hello: 'world!',
      taskId: `${task._id}`,
      type: `${task.taskType}`
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
      }); // Log the response from sending the message
    } else {
    console.log("No token found for owner:", owner.name);
  }
}

// DELETE TASKS
const DeleteTasks = async (req, res, next) => {
  try {
    const tasks = await Tasks.findByIdAndDelete(req.params.id);
    return res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

const SendAllTasks=async (req,res,next)=>{

  console.log(req.params)
  try{
    let tasks;

    if(req.query.params==='birdRecord' || req.query.params === 'earlyFeeding'){
     tasks = await Tasks.find({ 
            eggBirdId: { $exists: true, $ne: null } 
})
    .populate({
    path: "eggBirdId",
    select: "birdId birdSpecie birdName eggID cageNumber farm birdId gender birthDate exactBirthDate status source price imageURL couple ringNumber ",
     populate: [
    {
      path: "eggID",
      select: "clutch eggNumber eggsLaidDate",
      populate: {
        path: "clutch",
        select: "couple clutchNumber",
        populate: {
        path: "couple",
        select: "coupleId maleBird femaleBird",
        populate: [
            {
              path: "femaleBird",
              select: "imageURL"
            },
            {
              path: "maleBird",
              select: "imageURL"
            }
          ]
        
      },
     
      }
    },
    {
      path: "farm", 
      select: "farmName _id farmType" 
    },
       {
      path: "birdSpecie", 
      select: "_id name specieType" 
    },
      {
      path: "couple", 
      select: "_id coupleId" 
    }
  ]
 
  })
  .populate({
    path: "eggBirdId.farm",
    select: "_id farmType farmName"
  });
console.log("birdRecord");

  console.log(tasks)
  }
  else if(req.query.params==='treatment'){
  console.log("Medical task");
  tasks = await Tasks.find({ 
              $or: [
      { treatmentId: { $exists: true, $ne: null } },
      { birdId: { $exists: true, $ne: null } },
      { coupleId: { $exists: true, $ne: null } }
    ]
 // This condition checks for tasks where birdId exists and is not null.
})

for (let task of tasks) {
  // Initialize an array to hold populate options
  const populateOptions = [];
  
  // Check if treatmentId exists and push its populate option
  if (task.treatmentId) {
    populateOptions.push({
      path: 'treatmentId',
      select: 'treatmentStartDate treatmentName',
      // Add more populate options here if needed
    });

    if (task.birdId) {
    populateOptions.push({
      path: 'birdId',
      // Specify select fields if needed, e.g., 'name age'
    });
  }

  // Check if coupleId exists and push its populate option
  if (task.coupleId) {
    populateOptions.push({
      path: 'coupleId',
      // Specify select fields if needed
    });
  }
  }


  if (populateOptions.length > 0) {
  console.log("Medical task222");

    await Tasks.populate(task, populateOptions);
  }
}


  }
  else if(req.query.params==='nutrition'){
  console.log("Nutrition task");
  tasks = await Tasks.find({ 
              $or: [
      { nutritionId: { $exists: true, $ne: null } },
      // { birdId: { $exists: true, $ne: null } },
      // { coupleId: { $exists: true, $ne: null } }
    ]
 // This condition checks for tasks where birdId exists and is not null.
})

for (let task of tasks) {
 
  // Initialize an array to hold populate options
  const populateOptions = [];
  
  // Check if treatmentId exists and push its populate option
  if (task.nutritionId) {

    populateOptions.push({
      path: 'nutritionId',
      // select: 'Date mealType',
      // Add more populate options here if needed
    });

    if (task.birdId) {
    populateOptions.push({
      path: 'birdId',
      // Specify select fields if needed, e.g., 'name age'
    });
  }

  // Check if coupleId exists and push its populate option
  if (task.coupleId) {
    populateOptions.push({
      path: 'coupleId',
      // Specify select fields if needed
    });
  }
  }


  if (populateOptions.length > 0) {

    await Tasks.populate(task, populateOptions);
    console.log(task);
  }
}


  }
  
  else if(req.query.params==='hatching' || req.query.params ==='fertility'){
     tasks = await Tasks.find({ 
              $or: [
      { eggId: { $exists: true, $ne: null } }],} )
    .populate({
    path: "eggId",
    select: "clutch eggsLaidDate status eggNumber",
    populate: {
      path: "clutch",
      select: "incubationStartDate couple clutchNumber",
      populate: {
        path: "couple",
        select: "coupleId cageNumber",
   
     
      populate: [
            {
              path: "femaleBird",
              select: "imageURL"
            },
            {
              path: "maleBird",
              select: "imageURL"
            }
          ]
           },
    }
  });
  


}
    return res.status(200).json(tasks)

  }catch(e){
    next(e);
  }
}




module.exports={
    GetTasks,
    GetTasksByID,
    GetUserTasks,
    SendNotification,
    CreateTasks,
    UpdateTasks,
    DeleteTasks,
   SendAllTasks

}