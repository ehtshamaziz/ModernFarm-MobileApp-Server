const Task = require("../models/tasks");
var admin = require("../config/firebase");

// const sendCronNotification = async (token, task) => {
//   let populatedTask;
//   switch (task.taskType) {
//     case "hatchingTask":
//       populatedTask = await Task.findById(task._id).populate({
//         path: "eggId",
//         select: "eggNumber parentCouple clutch",
//         populate: [
//           { path: "clutch", select: "clutchNumber" },
//           { path: "parentCouple", select: "coupleId" },
//         ],
//       });

//       admin
//         .messaging()
//         .send({
//           token: token,
//           data: {
//             hello: "world!",
//             taskId: `${task._id}`,
//             date: task.taskDate.toLocaleDateString(),
//             type: `${task.taskType}`,
//             description: `Hatching task for egg number ${
//               populatedTask.eggId.eggNumber
//             }, part of clutch number ${
//               populatedTask.eggId.clutch.clutchNumber
//             }, from parent couple ${
//               populatedTask.eggId.parentCouple.coupleId
//             }. This task is scheduled to be completed on ${task.taskDate.toLocaleDateString()}.`,
//             url: "modernfarm://AllNotifications",
//           },
//         })
//         .then((response) => {
//           console.log(" messages were sent successfully for task", task._id);
//         })
//         .catch((error) => {
//           console.log(
//             "Error sending multicast message for task",
//             task._id,
//             ":",
//             error
//           );
//         });

//       break;
//     case "fertilityTask":
//       populatedTask = await Task.findById(task._id).populate({
//         path: "eggId",
//         select: "eggNumber parentCouple clutch",
//         populate: [
//           { path: "clutch", select: "clutchNumber" },
//           { path: "parentCouple", select: "coupleId" },
//         ],
//       });
//       admin
//         .messaging()
//         .send({
//           token: token,
//           data: {
//             hello: "world!",
//             taskId: `${task._id}`,
//             date: task.taskDate.toLocaleDateString(),
//             type: `${task.taskType}`,
//             description: `Fertility task for egg number ${
//               populatedTask.eggId.eggNumber
//             }, part of clutch number ${
//               populatedTask.eggId.clutch.clutchNumber
//             }, from parent couple ${
//               populatedTask.eggId.parentCouple.coupleId
//             }. This task is scheduled to be completed on ${task.taskDate.toLocaleDateString()}.`,
//             url: "modernfarm://AllNotifications",
//           },
//         })
//         .then((response) => {
//           console.log(" messages were sent successfully for task", task._id);
//         })
//         .catch((error) => {
//           console.log(
//             "Error sending multicast message for task",
//             task._id,
//             ":",
//             error
//           );
//         });

//       break;
//     case "medicalCareTask":
//       populatedTask = await Task.findById(task._id).populate([
//         { path: "birdId", select: "birdId" },
//         { path: "coupleId", select: "coupleId" },
//       ]);

//       admin
//         .messaging()
//         .send({
//           token: token,
//           data: {
//             hello: "world!",
//             taskId: `${task._id}`,
//             type: `${task.taskType}`,
//             date: task.taskDate.toLocaleDateString(),
//             description: `A treatment task is scheduled ${
//               task.birdId ? `for bird ${populatedTask.birdId.birdId}` : ""
//             }${
//               task.coupleId
//                 ? ` for couple ${populatedTask.coupleId.coupleId}`
//                 : ""
//             } on ${task.taskDate.toLocaleDateString()}.`,

//             url: "modernfarm://AllNotifications",
//           },
//         })
//         .then((response) => {
//           console.log(" messages were sent successfully for task", task._id);
//         })
//         .catch((error) => {
//           console.log(
//             "Error sending multicast message for task",
//             task._id,
//             ":",
//             error
//           );
//         });
//       break;
//     case "nutritionTask":
//       populatedTask = await Task.findById(task._id).populate([
//         { path: "birdId", select: "birdId" },
//         { path: "coupleId", select: "coupleId" },
//       ]);
//       admin
//         .messaging()
//         .send({
//           token: token,
//           data: {
//             hello: "world!",
//             taskId: `${task._id}`,
//             date: task.taskDate.toLocaleDateString(),
//             type: `${task.taskType}`,
//             description: `A nutrition task is scheduled ${
//               task.birdId ? "for bird " + populatedTask.birdId.birdId : ""
//             }${
//               task.coupleId
//                 ? " and for couple " + populatedTask.coupleId.coupleId
//                 : ""
//             } on ${task.taskDate.toLocaleDateString()}.`,

//             url: "modernfarm://AllNotifications",
//           },
//         })
//         .then((response) => {
//           console.log(" messages were sent successfully for task", task._id);
//         })
//         .catch((error) => {
//           console.log(
//             "Error sending multicast message for task",
//             task._id,
//             ":",
//             error
//           );
//         });
//       break;
//     case "earlyFeedingTask":
//       populatedTask = await Task.findById(task._id).populate({
//         path: "eggBirdId",
//         select: "birdId birdName eggId",
//       });
//       admin
//         .messaging()
//         .send({
//           token: token,
//           data: {
//             hello: "world!",
//             taskId: `${task._id}`,
//             date: task.taskDate.toLocaleDateString(),
//             type: `${task.taskType}`,
//             description: `Early Feeding task of ${
//               populatedTask.eggBirdId.birdId
//             } has to be done on ${task.taskDate.toLocaleDateString()}`,
//             url: "modernfarm://AllNotifications",
//           },
//         })
//         .then((response) => {
//           console.log(" messages were sent successfully for task", task._id);
//         })
//         .catch((error) => {
//           console.log(
//             "Error sending multicast message for task",
//             task._id,
//             ":",
//             error
//           );
//         });
//       break;
//     case "birdRecordTask":
//       populatedTask = await Task.findById(task._id).populate({
//         path: "eggBirdId",
//         select: "birdId birdName eggId",
//       });
//       admin
//         .messaging()
//         .send({
//           token: token,
//           data: {
//             hello: "world!",
//             taskId: `${task._id}`,
//             date: task.taskDate.toLocaleDateString(),
//             type: `${task.taskType}`,
//             description: `Bird Record task of ${
//               populatedTask.eggBirdId.birdId
//             } has to be done on ${task.taskDate.toLocaleDateString()}`,
//             url: "modernfarm://AllNotifications",
//           },
//         })
//         .then((response) => {
//           console.log(" messages were sent successfully for task", task._id);
//         })
//         .catch((error) => {
//           console.log(
//             "Error sending multicast message for task",
//             task._id,
//             ":",
//             error
//           );
//         });
//       break;
//     case "farmNote":
//       populatedTask = await Task.findById(task._id).populate([
//         { path: "user", select: "userToken" },
//         { path: "workerId", select: "workerToken" },
//       ]);

//       let noteWorkerToken;
//       if (populatedTask.workerId) {
//         noteWorkerToken = populatedTask.workerId.workerToken;
//       } else {
//         noteWorkerToken = populatedTask.user.userToken;
//       }

//       admin
//         .messaging()
//         .send({
//           token: noteWorkerToken,
//           data: {
//             hello: "world!",
//             taskId: `${task._id}`,
//             date: task.taskDate.toLocaleDateString(),
//             type: `${task.taskType}`,
//             description: `FarmNote task has to be done on ${task.taskDate.toLocaleDateString()}`,
//             url: "modernfarm://AllNotifications",
//           },
//         })
//         .then((response) => {
//           console.log(" messages were sent successfully for task", task._id);
//         })
//         .catch((error) => {
//           console.log(
//             "Error sending multicast message for task",
//             task._id,
//             ":",
//             error
//           );
//         });
//   }
// };

const sendCronNotification = async (token, task) => {
  let populatedTask;
  let description;
  let title = "Task Notification";
  let data = {
    hello: "world!",
    taskId: `${task._id}`,
    date: task.taskDate.toLocaleDateString(),
    type: `${task.taskType}`,
    url: "modernfarm://AllNotifications",
  };

  switch (task.taskType) {
    case "hatchingTask":
      populatedTask = await Task.findById(task._id).populate({
        path: "eggId",
        select: "eggNumber parentCouple clutch",
        populate: [
          { path: "clutch", select: "clutchNumber" },
          { path: "parentCouple", select: "coupleId" },
        ],
      });
      description = `Hatching task for egg number ${
        populatedTask.eggId.eggNumber
      }, part of clutch number ${
        populatedTask.eggId.clutch.clutchNumber
      }, from parent couple ${
        populatedTask.eggId.parentCouple.coupleId
      }. This task is scheduled to be completed on ${task.taskDate.toLocaleDateString()}.`;
      break;
    case "fertilityTask":
      populatedTask = await Task.findById(task._id).populate({
        path: "eggId",
        select: "eggNumber parentCouple clutch",
        populate: [
          { path: "clutch", select: "clutchNumber" },
          { path: "parentCouple", select: "coupleId" },
        ],
      });
      description = `Fertility task for egg number ${
        populatedTask.eggId.eggNumber
      }, part of clutch number ${
        populatedTask.eggId.clutch.clutchNumber
      }, from parent couple ${
        populatedTask.eggId.parentCouple.coupleId
      }. This task is scheduled to be completed on ${task.taskDate.toLocaleDateString()}.`;
      break;
    case "medicalCareTask":
      populatedTask = await Task.findById(task._id).populate([
        { path: "birdId", select: "birdId" },
        { path: "coupleId", select: "coupleId" },
      ]);
      description = `A treatment task is scheduled ${
        task.birdId ? `for bird ${populatedTask.birdId.birdId}` : ""
      }${
        task.coupleId ? ` for couple ${populatedTask.coupleId.coupleId}` : ""
      } on ${task.taskDate.toLocaleDateString()}.`;
      break;
    case "nutritionTask":
      populatedTask = await Task.findById(task._id).populate([
        { path: "birdId", select: "birdId" },
        { path: "coupleId", select: "coupleId" },
      ]);
      description = `A nutrition task is scheduled ${
        task.birdId ? "for bird " + populatedTask.birdId.birdId : ""
      }${
        task.coupleId
          ? " and for couple " + populatedTask.coupleId.coupleId
          : ""
      } on ${task.taskDate.toLocaleDateString()}.`;
      break;
    case "earlyFeedingTask":
      populatedTask = await Task.findById(task._id).populate({
        path: "eggBirdId",
        select: "birdId birdName eggId",
      });
      description = `Early Feeding task of ${
        populatedTask.eggBirdId.birdId
      } has to be done on ${task.taskDate.toLocaleDateString()}.`;
      break;
    case "birdRecordTask":
      populatedTask = await Task.findById(task._id).populate({
        path: "eggBirdId",
        select: "birdId birdName eggId",
      });
      description = `Bird Record task of ${
        populatedTask.eggBirdId.birdId
      } has to be done on ${task.taskDate.toLocaleDateString()}.`;
      break;
    case "farmNote":
      populatedTask = await Task.findById(task._id).populate([
        { path: "user", select: "userToken" },
        { path: "workerId", select: "workerToken" },
      ]);

      let noteWorkerToken;
      if (populatedTask.workerId) {
        noteWorkerToken = populatedTask.workerId.workerToken;
      } else {
        noteWorkerToken = populatedTask.user.userToken;
      }
      token = noteWorkerToken;
      description = `FarmNote task has to be done on ${task.taskDate.toLocaleDateString()}.`;
      break;
    default:
      description = "Unknown task type.";
      break;
  }

  data.description = description;

  try {
    await sendNotification({
      recipientToken: token,
      title,
      body: description,
      data,
      silent: true,
    });
    console.log("Messages were sent successfully for task", task._id);
  } catch (error) {
    console.log("Error sending message for task", task._id, ":", error);
  }
};

const sendNotification = async ({
  recipientToken,
  title,
  body,
  data = {},
  silent = false,
}) => {
  try {
    // Send FCM notification
    let message = {};
    if (silent) {
      message = {
        data,
        token: recipientToken,
      };
    } else {
      message = {
        notification: {
          title,
          body,
        },
        data,
        token: recipientToken,
      };
    }

    await admin.messaging().send(message);
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

module.exports = {
  sendCronNotification,
  sendNotification,
};
