const Task=require("../models/tasks");
var admin = require('firebase-admin');


async function sendCronNotification(token,task){
  let populatedTask;
  switch (task.taskType){

    case "hatchingTask":
       populatedTask = await Task.findById(task._id).populate({
              path:"eggId",
              select:"eggNumber parentCouple clutch",
              populate:[
                {path:"clutch",select:"clutchNumber"},
                {path:"parentCouple",select:"coupleId"}
              ]
            });

            admin.messaging().send({
                    token:token, 
                    data: {
                        hello: 'world!', // Customize your message payload as needed
                        taskId: `${task._id}`,
                        date:task.taskDate.toLocaleDateString(), 
                        type:`${task.taskType}`,
                        // workerName:`${owner.firstName}`,
                       description: `Hatching task for egg number ${populatedTask.eggId.eggNumber}, part of clutch number ${populatedTask.eggId.clutch.clutchNumber}, from parent couple ${populatedTask.eggId.parentCouple.coupleId}. This task is scheduled to be completed on ${task.taskDate.toLocaleDateString()}.`,
                        url: "modernfarm://AllNotifications",

                        // Example of including task-specific data
                    },
                })
                .then((response) => {
                    console.log(' messages were sent successfully for task', task._id);
                })
                .catch((error) => {
                    console.log('Error sending multicast message for task', task._id, ':', error);
                });


      break;
      case "fertilityTask":

        populatedTask = await Task.findById(task._id).populate({
              path:"eggId",
              select:"eggNumber parentCouple clutch",
              populate:[
                {path:"clutch",select:"clutchNumber"},
                {path:"parentCouple",select:"coupleId"}
              ]
            });
            admin.messaging().send({
                    token:token, 
                    data: {
                        hello: 'world!', // Customize your message payload as needed
                        taskId: `${task._id}`,
                        date:task.taskDate.toLocaleDateString(), 
                        type:`${task.taskType}`,
                        // workerName:`${worker.fullName}`,
                       description: `Fertility task for egg number ${populatedTask.eggId.eggNumber}, part of clutch number ${populatedTask.eggId.clutch.clutchNumber}, from parent couple ${populatedTask.eggId.parentCouple.coupleId}. This task is scheduled to be completed on ${task.taskDate.toLocaleDateString()}.`,
                        url: "modernfarm://AllNotifications",

                        // Example of including task-specific data
                    },
                })
                .then((response) => {
                    console.log(' messages were sent successfully for task', task._id);
                })
                .catch((error) => {
                    console.log('Error sending multicast message for task', task._id, ':', error);
                });


      break;
      case "medicalCareTask":
         populatedTask = await Task.findById(task._id).populate([
          { path:"birdId",select:"birdId"},
          { path:"coupleId",select:"coupleId"}
          ]);

      admin.messaging().send({
                    token:token, 
                    data: {
                        hello: 'world!', // Customize your message payload as needed
                        taskId: `${task._id}`, 
                        type:`${task.taskType}`,
                        date:task.taskDate.toLocaleDateString(),
                        // workerName:`${worker.fullName}`,
                        description: `A treatment task is scheduled ${task.birdId ? `for bird ${populatedTask.birdId.birdId}` : ''}${task.coupleId ? ` for couple ${populatedTask.coupleId.coupleId}` : ''} on ${task.taskDate.toLocaleDateString()}.`,
                       
                        url: "modernfarm://AllNotifications",

                        // Example of including task-specific data
                    },
                })
                .then((response) => {
                    console.log(' messages were sent successfully for task', task._id);
                })
                .catch((error) => {
                    console.log('Error sending multicast message for task', task._id, ':', error);
                });
      break;
      case "nutritionTask":
        
           populatedTask = await Task.findById(task._id).populate([
          { path:"birdId",select:"birdId"},
          { path:"coupleId",select:"coupleId"}
          ]);
          admin.messaging().send({
                    token:token, 
                    data: {
                        hello: 'world!', // Customize your message payload as needed
                        taskId: `${task._id}`,
                        date:task.taskDate.toLocaleDateString(), 
                        type:`${task.taskType}`,
                        // workerName:`${worker.fullName}`,
                        description: `A nutrition task is scheduled ${task.birdId ? 'for bird ' + populatedTask.birdId.birdId : ''}${task.coupleId ? ' and for couple ' + populatedTask.coupleId.coupleId : ''} on ${task.taskDate.toLocaleDateString()}.`,
                    
                        url: "modernfarm://AllNotifications",

                        // Example of including task-specific data
                    },
                })
                .then((response) => {
                    console.log(' messages were sent successfully for task', task._id);
                })
                .catch((error) => {
                    console.log('Error sending multicast message for task', task._id, ':', error);
                });
      break;
      case "earlyFeedingTask":
             populatedTask = await Task.findById(task._id).populate({
              path:"eggBirdId",
              select:"birdId birdName eggId",
              // populate:[
              //   {path:"clutch",select:"clutchNumber"},
              //   {path:"parentCouple",select:"coupleId"}
              // ]
            });
              admin.messaging().send({
                    token:token, 
                    data: {
                        hello: 'world!', // Customize your message payload as needed
                        taskId: `${task._id}`,
                        date:task.taskDate.toLocaleDateString(), 
                        type:`${task.taskType}`,
                        // workerName:`${owner.firstName}`,
                        description:`Early Feeding task of ${populatedTask.eggBirdId.birdId} has to be done on ${task.taskDate.toLocaleDateString()}`,
                        url: "modernfarm://AllNotifications",

                        // Example of including task-specific data
                    },
                })
                .then((response) => {
                    console.log(' messages were sent successfully for task', task._id);
                })
                .catch((error) => {
                    console.log('Error sending multicast message for task', task._id, ':', error);
                });
      break;
      case "birdRecordTask":
         populatedTask = await Task.findById(task._id).populate({
              path:"eggBirdId",
              select:"birdId birdName eggId",
              // populate:[
              //   {path:"clutch",select:"clutchNumber"},
              //   {path:"parentCouple",select:"coupleId"}
              // ]
            });
            admin.messaging().send({
                    token:token, 
                    data: {
                        hello: 'world!', // Customize your message payload as needed
                        taskId: `${task._id}`, 
                        date:task.taskDate.toLocaleDateString(),
                        type:`${task.taskType}`,
                        // workerName:`${worker.fullName}`,
                        description:`Bird Record task of ${populatedTask.eggBirdId.birdId} has to be done on ${task.taskDate.toLocaleDateString()}`,
                        url: "modernfarm://AllNotifications",

                        // Example of including task-specific data
                    },
                })
                .then((response) => {
                    console.log(' messages were sent successfully for task', task._id);
                })
                .catch((error) => {
                    console.log('Error sending multicast message for task', task._id, ':', error);
                });
      break;
  }


}
module.exports={
    sendCronNotification
}