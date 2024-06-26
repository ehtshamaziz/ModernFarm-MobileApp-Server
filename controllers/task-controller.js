const Tasks=require('../models/tasks')
const Egg=require("../models/egg")
const User=require("../models/user");
const Worker=require("../models/workers");
const {sendCronNotification}=require( "../utils/sendNotification")


var admin = require('firebase-admin');


// GET ALL TASKS
const GetTasks = async (req, res, next) => {
  console.log("Get all Tasks");
  try {
    if(req.query.ids){

    const idsString= req.query.ids;
    const idsArray= idsString.split(",")
    const tasks = await Tasks.find({_id: {$in : idsArray} });

       const populatedTasks = await Promise.all(tasks.map(async (task) => {
        if (task.taskType==='medicalCareTask') {
             let populateOptions = [{ path: 'treatmentId' }];

    // Check if `birdId` exists and add it to the population options
              if (task.birdId) {
             populateOptions.push({ path: 'birdId' });
                  }

    // Check if `coupleId` exists and add it to the population options
                if (task.coupleId) {
                    populateOptions.push({ path: 'coupleId' });
                              }

          return Tasks.populate(task, populateOptions);       
   } else if (task.taskType==='nutritionTask') {
         let populateOptions = [{ path: 'nutritionId' }];

    // Check if `birdId` exists and add it to the population options
          if (task.birdId) {
              populateOptions.push({ path: 'birdId' });
          }

    // Check if `coupleId` exists and add it to the population options
         if (task.coupleId) {
                populateOptions.push({ path: 'coupleId' });
             }

        return Tasks.populate(task, populateOptions);    
      }
         else if (task.taskType==='hatchingTask' || task.taskType==='fertilityTask') {
            return Tasks.populate(task, { path: 'eggId' });
        }
         else if (task.taskType==='birdRecordTask' || task.taskType==='earlyFeedingTask') {
            return Tasks.populate(task, { path: 'eggBirdId' });
        }
       
        return task;
    }));

    return res.status(200).send(populatedTasks);
    }
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

  } else if(req.query.allTask==='true'){
     tasks = await Tasks.find({ user: req.params.id})

  }else{
      tasks = await Tasks.find({ user: req.params.id})

  for (let task of tasks) {
    const populateOptions = [];

    switch (task.taskType) {
      case 'birdRecordTask':
      case 'earlyFeedingTask':

        populateOptions.push({
          path: 'eggBirdId',
          select: 'birdId birdSpecie birdName eggID cageNumber farm birdId gender birthDate exactBirthDate status source price imageURL couple ringNumber',
          populate: {
            path: 'eggID',
            select: 'clutch eggNumber eggsLaidDate',
            populate: {
              path: 'clutch',
              select: 'couple clutchNumber',
              populate: {
                path: 'couple',
                select: 'coupleId specie',
                populate: {
                  path: 'specie',
                  select: 'addRingAfter incubation addRingAfter startFeedingAfter'
                }
              }
            }
          }
        });

        break;
      case 'medicalCareTask':
       if (task.treatmentId) {
        populateOptions.push({
          path: 'treatmentId',
          select: 'treatmentStartDate treatmentName',
          // Add more populate options here if needed
        });
      }

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
        break;
      case 'nutritionTask':
    if (task.nutritionId) {
        populateOptions.push({
          path: 'nutritionId',
          select: 'mealDescription',
          // Add more populate options here if needed
        });
      }

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
        break;
      case 'hatchingTask':
      case 'fertilityTask':
        populateOptions.push({
          path: 'eggId',
          select: 'clutch eggsLaidDate status eggNumber',
          populate: {
            path: 'clutch',
            select: 'incubationStartDate couple clutchNumber',
            populate: {
              path: 'couple',
              select: 'coupleId cageNumber specie',
              populate: {
                path: 'specie',
                select: 'fertilityDays incubation addRingAfter startFeedingAfter'
              }
            }
          }
        });
        break;
    }
     populateOptions.push({
       path: 'farm',
       select: 'farmType farmName',
     })

    if (populateOptions.length > 0) {
      await Tasks.populate(task, populateOptions);
    }
  }

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

// const SendNotification=async (req,res,next)=>{
    
//   // const tasks = new Tasks(req.body);

//   console.log("helppp")

//   try{
//     const currentDate = new Date();
//     // currentDate.setHours(0, 0, 0, 0);
     
//      const tasks = await Tasks.find({ user: req.params.id, action:false,taskDate: { $lte: currentDate }})
//       // console.log(tasks);
//       if(tasks.length>=0){
//       await sendOwnerMessage(tasks);

//       await sendAllMessage(tasks);

//       }

//   }catch(error){
//     console.log(error)
//   }
// }

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




// async function getTokensFromDatastore(userId) {
//   try {
//     // Assuming your DeviceToken fmodel has a `userId` field
//     const worker = await Worker.findById(userId).exec();
//     const tokens = worker.workerToken;
//     console.log(tokens)
//     return tokens;
//   } catch (error) {
//     console.error('Failed to fetch tokens from datastore:', error);
//     throw error; // Rethrow the error to handle it in the calling context
//   }
// }

// async function sendOwnerMessage(tasks){
//   console.log(tasks)
//   console.log("taskssssss")

//   for (const task of tasks) {
//   console.log("ownerrssssss")
//           const owner = await User.findById(task.user)

//         console.log(task.farm);

//         if(task.taskType==='hatchingTask'){
//           console.log("hattttttttttt")
//         //    const users = await User.find({
//         //     farm: task.farm,
          
//         // });
//        const populatedTask = await Tasks.findById(task._id).populate({
//               path:"eggId",
//               select:"eggNumber parentCouple clutch",
//               populate:[
//                 {path:"clutch",select:"clutchNumber"},
//                 {path:"parentCouple",select:"coupleId"}
//               ]
//             });
//         console.log("Owner found for task:", owner);

//         // for (const user of users) {
//             const tokens = owner.userToken // Assuming getTokensFromDatastore returns tokens array
     

//             console.log("Tokens for worker", owner._id, tokens);

//             if (tokens && tokens.length > 0){
//                 console.log("Sending message for task", task._id, "to worker", owner._id);
//                  admin.messaging().send({
//                     token:tokens, 
//                     data: {
//                         hello: 'world!', // Customize your message payload as needed
//                         taskId: `${task._id}`,
//                         date:task.taskDate.toLocaleDateString(), 
//                         type:`${task.taskType}`,
//                         workerName:`${owner.firstName}`,
//                        description: `Hatching task for egg number ${populatedTask.eggId.eggNumber}, part of clutch number ${populatedTask.eggId.clutch.clutchNumber}, from parent couple ${populatedTask.eggId.parentCouple.coupleId}. This task is scheduled to be completed on ${task.taskDate.toLocaleDateString()}.`,
//                         url: "modernfarm://AllNotifications",

//                         // Example of including task-specific data
//                     },
//                 })
//                 .then((response) => {
//                     console.log(' messages were sent successfully for task', task._id);
//                 })
//                 .catch((error) => {
//                     console.log('Error sending multicast message for task', task._id, ':', error);
//                 });
//             // }
//         }
//         }
//          else if (task.taskType==='fertilityTask'){
//              console.log("fertttttttt")

//          const populatedTask = await Tasks.findById(task._id).populate({
//               path:"eggId",
//               select:"eggNumber parentCouple clutch",
//               populate:[
//                 {path:"clutch",select:"clutchNumber"},
//                 {path:"parentCouple",select:"coupleId"}
//               ]
//             });
//         console.log("Owner found for task:", owner);

//         // for (const worker of workers) {
//             const tokens =owner.userToken // Assuming getTokensFromDatastore returns tokens array

//             console.log("Tokens for worker", owner._id, tokens);

//             if (tokens && tokens.length > 0){
//                 console.log("Sending message for task", task._id, "to worker", owner._id);
//                  admin.messaging().send({
//                     token:tokens, 
//                     data: {
//                         hello: 'world!', // Customize your message payload as needed
//                         taskId: `${task._id}`,
//                         date:task.taskDate.toLocaleDateString(),
//                         type:`${task.taskType}`,
//                         workerName:`${owner.firstName}`,
//                        description: `Fertility task for egg number ${populatedTask.eggId.eggNumber}, part of clutch number ${populatedTask.eggId.clutch.clutchNumber}, from parent couple ${populatedTask.eggId.parentCouple.coupleId}. This task is scheduled to be completed on ${task.taskDate.toLocaleDateString()}.`,
//                         url: "modernfarm://AllNotifications",

//                         // Example of including task-specific data
//                     },
//                 })
//                 .then((response) => {
//                     console.log(' messages were sent successfully for task', task._id);
//                 })
//                 .catch((error) => {
//                     console.log('Error sending multicast message for task', task._id, ':', error);
//                 });
//             // }
//         }
//         }
//         else if (task.taskType==='medicalCareTask'){
           
//       const populatedTask = await Tasks.findById(task._id).populate([
//           { path:"birdId",select:"birdId"},
//           { path:"coupleId",select:"coupleId"}
//           ]);

//         console.log("Owner found for task:", owner);

//         // for (const worker of workers) {
//             const tokens = owner.userToken// Assuming getTokensFromDatastore returns tokens array

//             console.log("Tokens for worker", owner._id, tokens);

//             if (tokens && tokens.length > 0){
//                 console.log("Sending message for task", task._id, "to worker", owner._id);
//                  admin.messaging().send({
//                     token:tokens, 
//                     data: {
//                         hello: 'world!', // Customize your message payload as needed
//                         taskId: `${task._id}`,
//                         date:task.taskDate.toLocaleDateString(),
//                         type:`${task.taskType}`,
//                         workerName:`${owner.firstName}`,
//                         description: `A treatment task is scheduled ${task.birdId ? `for bird ${populatedTask.birdId.birdId}` : ''}${task.coupleId ? ` for couple ${populatedTask.coupleId.coupleId}` : ''} on ${task.taskDate.toLocaleDateString()}.`,
                       
//                         url: "modernfarm://AllNotifications",

//                         // Example of including task-specific data
//                     },
//                 })
//                 .then((response) => {
//                     console.log(' messages were sent successfully for task', task._id);
//                 })
//                 .catch((error) => {
//                     console.log('Error sending multicast message for task', task._id, ':', error);
//                 });
//             // }
//         }
//         }
//         else if (task.taskType==='nutritionTask'){
     


//           const populatedTask = await Tasks.findById(task._id).populate([
//           { path:"birdId",select:"birdId"},
//           { path:"coupleId",select:"coupleId"}
//           ]);


//         // for (const worker of workers) {
//             const tokens = owner.userToken // Assuming getTokensFromDatastore returns tokens array

//             console.log("Tokens for worker", owner._id, tokens);


//             if (tokens && tokens.length > 0){
//                 console.log("Sending message for task", task._id, "to worker", owner._id);
//                  admin.messaging().send({
//                     token:tokens, 
//                     data: {
//                         hello: 'world!', // Customize your message payload as needed
//                         taskId: `${task._id}`,
//                         date:task.taskDate.toLocaleDateString(), 
//                         type:`${task.taskType}`,
//                         workerName:`${owner.firstName}`,
//                         description: `A nutrition task is scheduled ${task.birdId ? 'for bird ' + populatedTask.birdId.birdId : ''}${task.coupleId ? '  for couple ' + populatedTask.coupleId.coupleId : ''} on ${task.taskDate.toLocaleDateString()}.`,
                    
//                         url: "modernfarm://AllNotifications",

//                         // Example of including task-specific data
//                     },
//                 })
//                 .then((response) => {
//                     console.log(' messages were sent successfully for task', task._id);
//                 })
//                 .catch((error) => {
//                     console.log('Error sending multicast message for task', task._id, ':', error);
//                 });
//             }
//         // }
//         }
//         else if (task.taskType==='externalFeedingTask'){
           
//                const populatedTask = await Tasks.findById(task._id).populate({
//               path:"eggBirdId",
//               select:"birdId birdName eggId",
//               // populate:[
//               //   {path:"clutch",select:"clutchNumber"},
//               //   {path:"parentCouple",select:"coupleId"}
//               // ]
//             });


//             const tokens = owner.userToken // Assuming getTokensFromDatastore returns tokens array

//             console.log("Tokens for worker", owner._id, tokens);

//             if (tokens && tokens.length > 0){
//                 console.log("Sending message for task", task._id, "to worker", owner._id);
//                  admin.messaging().send({
//                     token:tokens, 
//                     data: {
//                         hello: 'world!', // Customize your message payload as needed
//                         taskId: `${task._id}`,
//                         date:task.taskDate.toLocaleDateString(), 
//                         type:`${task.taskType}`,
//                         workerName:`${owner.firstName}`,
//                         description:`Early Feeding task of ${populatedTask.eggBirdId.birdId} has to be done on ${task.taskDate.toLocaleDateString()}`,
//                         url: "modernfarm://AllNotifications",

//                         // Example of including task-specific data
//                     },
//                 })
//                 .then((response) => {
//                     console.log(' messages were sent successfully for task', task._id);
//                 })
//                 .catch((error) => {
//                     console.log('Error sending multicast message for task', task._id, ':', error);
//                 });
//         }
//         }
//          else if (task.taskType==='birdRecordTask'){
      
//          const populatedTask = await Tasks.findById(task._id).populate({
//               path:"eggBirdId",
//               select:"birdId birdName eggId",
//               // populate:[
//               //   {path:"clutch",select:"clutchNumber"},
//               //   {path:"parentCouple",select:"coupleId"}
//               // ]
//             });


//             const tokens = owner.userToken// Assuming getTokensFromDatastore returns tokens array

//             console.log("Tokens for worker", owner._id, tokens);

//             if (tokens && tokens.length > 0){
//                 console.log("Sending message for task", task._id, "to worker", owner._id);
//                  admin.messaging().send({
//                     token:tokens, 
//                     data: {
//                         hello: 'world!', // Customize your message payload as needed
//                         taskId: `${task._id}`,
//                         date:task.taskDate.toLocaleDateString(), 
//                         type:`${task.taskType}`,
//                         workerName:`${owner.firstName}`,
//                         description:`Bird Record task of ${populatedTask.eggBirdId.birdId} has to be done on ${task.taskDate.toLocaleDateString()}`,
//                         url: "modernfarm://AllNotifications",

//                         // Example of including task-specific data
//                     },
//                 })
//                 .then((response) => {
//                     console.log(' messages were sent successfully for task', task._id);
//                 })
//                 .catch((error) => {
//                     console.log('Error sending multicast message for task', task._id, ':', error);
//                 });
//             }
//         }
        


       
//     }
// }

//    async function sendAllMessage(tasks) {

//       for (const task of tasks) {
//         console.log(task.farm);

//         if(task.taskType==='hatchingTask'){
//            const workers = await Worker.find({
//             farm: task.farm,
//            'notificationRights.hatching': true,
          
//         });
//        const populatedTask = await Tasks.findById(task._id).populate({
//               path:"eggId",
//               select:"eggNumber parentCouple clutch",
//               populate:[
//                 {path:"clutch",select:"clutchNumber"},
//                 {path:"parentCouple",select:"coupleId"}
//               ]
//             });
//         console.log("Workers found for task:", workers);

//         for (const worker of workers) {
//             const tokens = await getTokensFromDatastore(worker._id); // Assuming getTokensFromDatastore returns tokens array
     

//             console.log("Tokens for worker", worker._id, tokens);

//             if (tokens && tokens.length > 0){
//                 console.log("Sending message for task", task._id, "to worker", worker._id);
//                  admin.messaging().send({
//                     token:tokens, 
//                     data: {
//                         hello: 'world!', // Customize your message payload as needed
//                         taskId: `${task._id}`, 
//                         date:task.taskDate.toLocaleDateString(),
//                         type:`${task.taskType}`,
//                         workerName:`${worker.fullName}`,
//                        description: `Hatching task for egg number ${populatedTask.eggId.eggNumber}, part of clutch number ${populatedTask.eggId.clutch.clutchNumber}, from parent couple ${populatedTask.eggId.parentCouple.coupleId}. This task is scheduled to be completed on ${task.taskDate.toLocaleDateString()}.`,
//                         url: "modernfarm://AllNotifications",

//                         // Example of including task-specific data
//                     },
//                 })
//                 .then((response) => {
//                     console.log(' messages were sent successfully for task', task._id);
//                 })
//                 .catch((error) => {
//                     console.log('Error sending multicast message for task', task._id, ':', error);
//                 });
//             }
//         }
//         }
//          else if (task.taskType==='fertilityTask'){
//            const workers = await Worker.find({
//             farm: task.farm,
//            'notificationRights.fertility': true,
          
//         });
//          const populatedTask = await Tasks.findById(task._id).populate({
//               path:"eggId",
//               select:"eggNumber parentCouple clutch",
//               populate:[
//                 {path:"clutch",select:"clutchNumber"},
//                 {path:"parentCouple",select:"coupleId"}
//               ]
//             });
//         console.log("Workers found for task:", workers);

//         for (const worker of workers) {
//             const tokens = await getTokensFromDatastore(worker._id); // Assuming getTokensFromDatastore returns tokens array

//             console.log("Tokens for worker", worker._id, tokens);

//             if (tokens && tokens.length > 0){
//                 console.log("Sending message for task", task._id, "to worker", worker._id);
//                  admin.messaging().send({
//                     token:tokens, 
//                     data: {
//                         hello: 'world!', // Customize your message payload as needed
//                         taskId: `${task._id}`,
//                         date:task.taskDate.toLocaleDateString(), 
//                         type:`${task.taskType}`,
//                         workerName:`${worker.fullName}`,
//                        description: `Fertility task for egg number ${populatedTask.eggId.eggNumber}, part of clutch number ${populatedTask.eggId.clutch.clutchNumber}, from parent couple ${populatedTask.eggId.parentCouple.coupleId}. This task is scheduled to be completed on ${task.taskDate.toLocaleDateString()}.`,
//                         url: "modernfarm://AllNotifications",

//                         // Example of including task-specific data
//                     },
//                 })
//                 .then((response) => {
//                     console.log(' messages were sent successfully for task', task._id);
//                 })
//                 .catch((error) => {
//                     console.log('Error sending multicast message for task', task._id, ':', error);
//                 });
//             }
//         }
//         }
//         else if (task.taskType==='medicalCareTask'){
//            const workers = await Worker.find({
//             farm: task.farm,
//            'notificationRights.medicine': true,
          
//         });
//       const populatedTask = await Tasks.findById(task._id).populate([
//           { path:"birdId",select:"birdId"},
//           { path:"coupleId",select:"coupleId"}
//           ]);

//         console.log("Workers found for task:", workers);

//         for (const worker of workers) {
//             const tokens = await getTokensFromDatastore(worker._id); // Assuming getTokensFromDatastore returns tokens array

//             console.log("Tokens for worker", worker._id, tokens);

//             if (tokens && tokens.length > 0){
//                 console.log("Sending message for task", task._id, "to worker", worker._id);
//                  admin.messaging().send({
//                     token:tokens, 
//                     data: {
//                         hello: 'world!', // Customize your message payload as needed
//                         taskId: `${task._id}`, 
//                         type:`${task.taskType}`,
//                         date:task.taskDate.toLocaleDateString(),
//                         workerName:`${worker.fullName}`,
//                         description: `A treatment task is scheduled ${task.birdId ? `for bird ${populatedTask.birdId.birdId}` : ''}${task.coupleId ? ` for couple ${populatedTask.coupleId.coupleId}` : ''} on ${task.taskDate.toLocaleDateString()}.`,
                       
//                         url: "modernfarm://AllNotifications",

//                         // Example of including task-specific data
//                     },
//                 })
//                 .then((response) => {
//                     console.log(' messages were sent successfully for task', task._id);
//                 })
//                 .catch((error) => {
//                     console.log('Error sending multicast message for task', task._id, ':', error);
//                 });
//             }
//         }
//         }
//         else if (task.taskType==='nutritionTask'){
//            const workers = await Worker.find({
//             farm: task.farm,
//            'notificationRights.nutrition': true,
          
//         });

//         console.log("Workers found for task:", workers);

//           const populatedTask = await Tasks.findById(task._id).populate([
//           { path:"birdId",select:"birdId"},
//           { path:"coupleId",select:"coupleId"}
//           ]);


//         for (const worker of workers) {
//             const tokens = await getTokensFromDatastore(worker._id); // Assuming getTokensFromDatastore returns tokens array

//             console.log("Tokens for worker", worker._id, tokens);


//             if (tokens && tokens.length > 0){
//                 console.log("Sending message for task", task._id, "to worker", worker._id);
//                  admin.messaging().send({
//                     token:tokens, 
//                     data: {
//                         hello: 'world!', // Customize your message payload as needed
//                         taskId: `${task._id}`,
//                         date:task.taskDate.toLocaleDateString(), 
//                         type:`${task.taskType}`,
//                         workerName:`${worker.fullName}`,
//                         description: `A nutrition task is scheduled ${task.birdId ? 'for bird ' + populatedTask.birdId.birdId : ''}${task.coupleId ? ' and for couple ' + populatedTask.coupleId.coupleId : ''} on ${task.taskDate.toLocaleDateString()}.`,
                    
//                         url: "modernfarm://AllNotifications",

//                         // Example of including task-specific data
//                     },
//                 })
//                 .then((response) => {
//                     console.log(' messages were sent successfully for task', task._id);
//                 })
//                 .catch((error) => {
//                     console.log('Error sending multicast message for task', task._id, ':', error);
//                 });
//             }
//         }
//         }
//         else if (task.taskType==='externalFeedingTask'){
//            const workers = await Worker.find({
//             farm: task.farm,
//            'notificationRights.externalFeeding': true,
          
//         });
//                const populatedTask = await Tasks.findById(task._id).populate({
//               path:"eggBirdId",
//               select:"birdId birdName eggId",
//               // populate:[
//               //   {path:"clutch",select:"clutchNumber"},
//               //   {path:"parentCouple",select:"coupleId"}
//               // ]
//             });

//         console.log("Workers found for task:", workers);

//         for (const worker of workers) {
//             const tokens = await getTokensFromDatastore(worker._id); // Assuming getTokensFromDatastore returns tokens array

//             console.log("Tokens for worker", worker._id, tokens);

//             if (tokens && tokens.length > 0){
//                 console.log("Sending message for task", task._id, "to worker", worker._id);
//                  admin.messaging().send({
//                     token:tokens, 
//                     data: {
//                         hello: 'world!', // Customize your message payload as needed
//                         taskId: `${task._id}`, 
//                         date:task.taskDate.toLocaleDateString(),
//                         type:`${task.taskType}`,
//                         workerName:`${worker.fullName}`,
//                         description:`Early Feeding task of ${populatedTask.eggBirdId.birdId} has to be done on ${task.taskDate.toLocaleDateString()}`,
//                         url: "modernfarm://AllNotifications",

//                         // Example of including task-specific data
//                     },
//                 })
//                 .then((response) => {
//                     console.log(' messages were sent successfully for task', task._id);
//                 })
//                 .catch((error) => {
//                     console.log('Error sending multicast message for task', task._id, ':', error);
//                 });
//             }
//         }
//         }
//          else if (task.taskType==='birdRecordTask'){
//            const workers = await Worker.find({
//             farm: task.farm,
//            'notificationRights.ringNumber': true,
          
//         });
//          const populatedTask = await Tasks.findById(task._id).populate({
//               path:"eggBirdId",
//               select:"birdId birdName eggId",
//               // populate:[
//               //   {path:"clutch",select:"clutchNumber"},
//               //   {path:"parentCouple",select:"coupleId"}
//               // ]
//             });

//         console.log("Workers found for task:", workers);

//         for (const worker of workers) {
//             const tokens = await getTokensFromDatastore(worker._id); // Assuming getTokensFromDatastore returns tokens array

//             console.log("Tokens for worker", worker._id, tokens);

//             if (tokens && tokens.length > 0){
//                 console.log("Sending message for task", task._id, "to worker", worker._id);
//                  admin.messaging().send({
//                     token:tokens, 
//                     data: {
//                         hello: 'world!', // Customize your message payload as needed
//                         taskId: `${task._id}`, 
//                         date:task.taskDate.toLocaleDateString(),
//                         type:`${task.taskType}`,
//                         workerName:`${worker.fullName}`,
//                         description:`Bird Record task of ${populatedTask.eggBirdId.birdId} has to be done on ${task.taskDate.toLocaleDateString()}`,
//                         url: "modernfarm://AllNotifications",

//                         // Example of including task-specific data
//                     },
//                 })
//                 .then((response) => {
//                     console.log(' messages were sent successfully for task', task._id);
//                 })
//                 .catch((error) => {
//                     console.log('Error sending multicast message for task', task._id, ':', error);
//                 });
//             }
//         }
//         }
        


       
//     }
// }

async function SendCronMessage(req, res,next){
  try{
    // const currentDate=new Date();
    // currentDate.setHours(0, 0, 0, 0);

    const users=await User.find();
    for(const user of users){
      const workers= await Worker.find({user:user._id});
      const currentDate = new Date();
      currentDate.setMinutes(currentDate.getMinutes() - user.timezoneOffset);
      currentDate.setHours(0, 0, 0, 0);
      
      const tasks=await Tasks.find({user:user._id, action:false,taskDate: { $lte: currentDate }});
      for (const task of tasks){
     
        if(user.userToken){
        await sendCronNotification(user.userToken, task)
        }
        for (const worker of workers){
         if(worker.accessRights[task.taskType] && worker.workerToken){
           await sendCronNotification(worker.workerToken, task)
        }
        }
      } 
    }
        return res.status(200).send("Messages sent successfully!");
   


  }catch(err){
    console.log(err)
    return res.status(500).send("An error occurred while sending messages.");

  }

}



   async function sendMessage(task) {

    const owner = await User.findById(task.user)
    let worker;
    if(task.workerId){
       worker=await Worker.findById(task.workerId)
    }

     const tokens =  owner.userToken;
  
        if(task.taskType==='hatchingTask'){
     
       const populatedTask = await Tasks.findById(task._id).populate({
              path:"eggId",
              select:"eggNumber parentCouple clutch",
              populate:[
                {path:"clutch",select:"clutchNumber"},
                {path:"parentCouple",select:"coupleId"}
              ]
            });
              const message = {
    token:tokens,  // Device token
    data: {
      hello: 'world!',
      taskId: `${task._id}`,
      date:task.taskDate.toLocaleDateString(),
      type: `${task.taskType}`,
      description:`Hatching task for egg number ${populatedTask.eggId.eggNumber}, part of clutch number ${populatedTask.eggId.clutch.clutchNumber}, from parent couple ${populatedTask.eggId.parentCouple.coupleId} has been completed by ${task.workerId ?worker.fullName :owner.firstName}`,
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
   else if (task.taskType==='fertilityTask'){
          
         const populatedTask = await Tasks.findById(task._id).populate({
              path:"eggId",
              select:"eggNumber parentCouple clutch",
              populate:[
                {path:"clutch",select:"clutchNumber"},
                {path:"parentCouple",select:"coupleId"}
              ]
            });
              const message = {
    token:tokens,  // Device token
    data: {
      hello: 'world!',
      taskId: `${task._id}`,
      date:task.taskDate.toLocaleDateString(),
      type: `${task.taskType}`,
      description:`Fertility task for egg number ${populatedTask.eggId.eggNumber}, part of clutch number ${populatedTask.eggId.clutch.clutchNumber}, from parent couple ${populatedTask.eggId.parentCouple.coupleId} has been completed by ${task.workerId ?worker.fullName :owner.firstName}`,
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
  else if (task.taskType==='medicalCareTask'){
       
      const populatedTask = await Tasks.findById(task._id).populate([
          { path:"birdId",select:"birdId"},
          { path:"coupleId",select:"coupleId"}
          ]);
        const message = {
    token:tokens,  // Device token
    data: {
      hello: 'world!',
      taskId: `${task._id}`,
      date:task.taskDate.toLocaleDateString(),
      type: `${task.taskType}`,
      description:`A treatment task  ${task.birdId ? `for bird ${populatedTask.birdId.birdId}` : ''}${task.coupleId ? ` for couple ${populatedTask.coupleId.coupleId}` : ''} has been completed by ${task.workerId ?worker.fullName :owner.firstName}`,
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

        // 
     else if (task.taskType==='nutritionTask'){
    


          const populatedTask = await Tasks.findById(task._id).populate([
          { path:"birdId",select:"birdId"},
          { path:"coupleId",select:"coupleId"}
          ]);
            const message = {
    token:tokens,  // Device token
    data: {
      hello: 'world!',
      taskId: `${task._id}`,
      date:task.taskDate.toLocaleDateString(),
      type: `${task.taskType}`,
      description:`A nutrition task  ${task.birdId ? 'for bird ' + populatedTask.birdId.birdId : ''}${task.coupleId ? ' and for couple ' + populatedTask.coupleId.coupleId : ''} has been completed by ${task.workerId ?worker.fullName :owner.firstName}`,
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
  else if (task.taskType==='externalFeedingTask'){
           
               const populatedTask = await Tasks.findById(task._id).populate({
              path:"eggBirdId",
              select:"birdId birdName eggId",
              // populate:[
              //   {path:"clutch",select:"clutchNumber"},
              //   {path:"parentCouple",select:"coupleId"}
              // ]
            });
              const message = {
    token:tokens,  // Device token
    data: {
      hello: 'world!',
      taskId: `${task._id}`,
      date:task.taskDate.toLocaleDateString(),
      type: `${task.taskType}`,
      description:`Early Feeding task of ${populatedTask.eggBirdId.birdId} has been completed by ${task.workerId ?worker.fullName :owner.firstName}`,
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
 else if (task.taskType==='birdRecordTask'){
      
         const populatedTask = await Tasks.findById(task._id).populate({
              path:"eggBirdId",
              select:"birdId birdName eggId",
              // populate:[
              //   {path:"clutch",select:"clutchNumber"},
              //   {path:"parentCouple",select:"coupleId"}
              // ]
            });
              const message = {
    token:tokens,  // Device token
    data: {
      hello: 'world!',
      taskId: `${task._id}`,
      date:task.taskDate.toLocaleDateString(),
      type: `${task.taskType}`,
      description:`Bird Record task of ${populatedTask.eggBirdId.birdId} has been completed by ${task.workerId ?worker.fullName :owner.firstName}`,
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
  if (tokens) {
      console.log("Sending message to",owner.firstName);
      // Log the response from sending the message
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
  })
    .populate({
    path: "user",
    select: "firstName"
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
  populateOptions.push({
      path: 'user',
      select:'firstName'
    });
      populateOptions.push({
      path: 'farm',
      select:'farmName'
      // Specify select fields if needed
    });
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
    populateOptions.push({
      path: 'user',
      select:'firstName'
      // Specify select fields if needed
    });
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
  }) 
  .populate({
    path: "user",
    select: "firstName"
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
    CreateTasks,
    UpdateTasks,
    DeleteTasks,
    SendAllTasks,
    SendCronMessage,

}