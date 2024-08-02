const Tasks = require("../models/tasks");
const User = require("../models/user");
const Worker = require("../models/workers");
const {
  sendCronNotification,
  sendNotification,
} = require("../utils/sendNotification");

// GET ALL TASKS
const GetTasks = async (req, res, next) => {
  console.log("Get all Tasks");
  try {
    if (req.query.ids) {
      const idsString = req.query.ids;
      const idsArray = idsString.split(",");
      const tasks = await Tasks.find({ _id: { $in: idsArray } });

      const populatedTasks = await Promise.all(
        tasks.map(async (task) => {
          if (task.taskType === "medicalCareTask") {
            let populateOptions = [{ path: "treatmentId" }];

            // Check if `birdId` exists and add it to the population options
            if (task.birdId) {
              populateOptions.push({ path: "birdId" });
            }

            // Check if `coupleId` exists and add it to the population options
            if (task.coupleId) {
              populateOptions.push({ path: "coupleId" });
            }

            return Tasks.populate(task, populateOptions);
          } else if (task.taskType === "nutritionTask") {
            let populateOptions = [{ path: "nutritionId" }];

            // Check if `birdId` exists and add it to the population options
            if (task.birdId) {
              populateOptions.push({ path: "birdId" });
            }

            // Check if `coupleId` exists and add it to the population options
            if (task.coupleId) {
              populateOptions.push({ path: "coupleId" });
            }

            return Tasks.populate(task, populateOptions);
          } else if (
            task.taskType === "hatchingTask" ||
            task.taskType === "fertilityTask"
          ) {
            return Tasks.populate(task, { path: "eggId" });
          } else if (
            task.taskType === "birdRecordTask" ||
            task.taskType === "earlyFeedingTask"
          ) {
            return Tasks.populate(task, { path: "eggBirdId" });
          }

          return task;
        })
      );

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

    if (req.query.birdTasks === "true") {
      tasks = await Tasks.find({
        user: req.params.id,
        eggBirdId: { $exists: true, $ne: null }, // This condition checks for tasks where birdId exists and is not null.
      })
        .populate({
          path: "eggBirdId",
          select:
            "birdId birdSpecie birdName eggID cageNumber farm birdId gender birthDate exactBirthDate status source price imageURL couple ringNumber ",
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
                    select:
                      "addRingAfter incubation addRingAfter startFeedingAfter",
                  },
                },
              },
            },
            {
              path: "farm",
              select: "farmName _id farmType",
            },
            {
              path: "birdSpecie",
              select: "_id name specieType",
            },
            {
              path: "couple",
              select: "_id coupleId",
            },
          ],
        })
        .populate({
          path: "eggBirdId.farm",
          select: "_id farmType farmName",
        });
      console.log(tasks);
    } else if (req.query.medicalTasks === "true") {
      console.log("Medical task");
      tasks = await Tasks.find({
        user: req.params.id,
        $or: [
          { treatmentId: { $exists: true, $ne: null } },
          { birdId: { $exists: true, $ne: null } },
          { coupleId: { $exists: true, $ne: null } },
        ],
        // This condition checks for tasks where birdId exists and is not null.
      });

      for (let task of tasks) {
        // Initialize an array to hold populate options
        const populateOptions = [];

        // Check if treatmentId exists and push its populate option
        if (task.treatmentId) {
          populateOptions.push({
            path: "treatmentId",
            select: "treatmentStartDate treatmentName",
            // Add more populate options here if needed
          });

          if (task.birdId) {
            populateOptions.push({
              path: "birdId",
              // Specify select fields if needed, e.g., 'name age'
            });
          }

          // Check if coupleId exists and push its populate option
          if (task.coupleId) {
            populateOptions.push({
              path: "coupleId",
              // Specify select fields if needed
            });
          }
        }

        if (populateOptions.length > 0) {
          console.log("Medical task222");

          await Tasks.populate(task, populateOptions);
        }
      }
    } else if (req.query.nutritionTasks === "true") {
      console.log("Nutrition task");
      tasks = await Tasks.find({
        user: req.params.id,
        $or: [
          { nutritionId: { $exists: true, $ne: null } },
          // { birdId: { $exists: true, $ne: null } },
          // { coupleId: { $exists: true, $ne: null } }
        ],
        // This condition checks for tasks where birdId exists and is not null.
      });
      console.log(tasks);

      for (let task of tasks) {
        // Initialize an array to hold populate options
        const populateOptions = [];

        // Check if treatmentId exists and push its populate option
        if (task.nutritionId) {
          console.log("b");

          populateOptions.push({
            path: "nutritionId",
            // select: 'Date mealType',
            // Add more populate options here if needed
          });

          if (task.birdId) {
            populateOptions.push({
              path: "birdId",
              // Specify select fields if needed, e.g., 'name age'
            });
          }

          // Check if coupleId exists and push its populate option
          if (task.coupleId) {
            populateOptions.push({
              path: "coupleId",
              // Specify select fields if needed
            });
          }
        }

        if (populateOptions.length > 0) {
          await Tasks.populate(task, populateOptions);
          console.log(task);
        }
      }
    } else if (req.query.eggTasks === "true") {
      tasks = await Tasks.find({
        user: req.params.id,
        $or: [{ eggId: { $exists: true, $ne: null } }],
      }).populate({
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
              select: "fertilityDays incubation addRingAfter startFeedingAfter",
            },
          },
        },
      });
    } else if (req.query.allTask === "true") {
      tasks = await Tasks.find({ user: req.params.id });
    } else {
      tasks = await Tasks.find({ user: req.params.id });

      for (let task of tasks) {
        const populateOptions = [];

        switch (task.taskType) {
          case "birdRecordTask":
          case "earlyFeedingTask":
            populateOptions.push({
              path: "eggBirdId",
              select:
                "birdId birdSpecie birdName eggID cageNumber farm birdId gender birthDate exactBirthDate status source price imageURL couple ringNumber",
              populate: {
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
                      select:
                        "addRingAfter incubation addRingAfter startFeedingAfter",
                    },
                  },
                },
              },
            });

            break;
          case "medicalCareTask":
            if (task.treatmentId) {
              populateOptions.push({
                path: "treatmentId",
                select: "treatmentStartDate treatmentName",
                // Add more populate options here if needed
              });
            }

            if (task.birdId) {
              populateOptions.push({
                path: "birdId",
                // Specify select fields if needed, e.g., 'name age'
              });
            }

            // Check if coupleId exists and push its populate option
            if (task.coupleId) {
              populateOptions.push({
                path: "coupleId",
                // Specify select fields if needed
              });
            }
            break;
          case "nutritionTask":
            if (task.nutritionId) {
              populateOptions.push({
                path: "nutritionId",
                select: "mealDescription",
                // Add more populate options here if needed
              });
            }

            if (task.birdId) {
              populateOptions.push({
                path: "birdId",
                // Specify select fields if needed, e.g., 'name age'
              });
            }

            // Check if coupleId exists and push its populate option
            if (task.coupleId) {
              populateOptions.push({
                path: "coupleId",
                // Specify select fields if needed
              });
            }
            break;
          case "hatchingTask":
          case "fertilityTask":
            populateOptions.push({
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
                    select:
                      "fertilityDays incubation addRingAfter startFeedingAfter",
                  },
                },
              },
            });
            break;
        }
        populateOptions.push({
          path: "farm",
          select: "farmType farmName",
        });

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

const SendCronMessage = async (req, res, next) => {
  try {
    const users = await User.find();
    for (const user of users) {
      const workers = await Worker.find({ user: user._id });
      const currentDate = new Date();
      currentDate.setMinutes(currentDate.getMinutes() - user.timezoneOffset);
      currentDate.setHours(0, 0, 0, 0);

      const tasks = await Tasks.find({
        user: user._id,
        action: false,
        taskDate: { $lte: currentDate },
      });
      for (const task of tasks) {
        if (user.userToken) {
          await sendCronNotification(user.userToken, task);
        }
        for (const worker of workers) {
          if (worker.accessRights[task.taskType] && worker.workerToken) {
            await sendCronNotification(worker.workerToken, task);
          }
        }
      }
    }
    return res.status(200).send("Messages sent successfully!");
  } catch (err) {
    console.log(err);
    return res.status(500).send("An error occurred while sending messages.");
  }
};

const sendMessage = async (task) => {
  const owner = await User.findById(task.user);
  let worker;
  if (task.workerId) {
    worker = await Worker.findById(task.workerId);
  }

  const token = owner.userToken;
  let populatedTask;
  let description;
  let data = {
    hello: "world!",
    taskId: `${task._id}`,
    date: task.taskDate.toLocaleDateString(),
    type: `${task.taskType}`,
    taskType: "owner",
  };
  let title = "New Task Available";
  let body = `A new task of type ${task.taskType} is available.`;

  switch (task.taskType) {
    case "hatchingTask":
      populatedTask = await Tasks.findById(task._id).populate({
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
      } has been completed by ${
        task.workerId ? worker.fullName : owner.firstName
      }`;
      break;
    case "fertilityTask":
      populatedTask = await Tasks.findById(task._id).populate({
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
      } has been completed by ${
        task.workerId ? worker.fullName : owner.firstName
      }`;
      break;
    case "medicalCareTask":
      populatedTask = await Tasks.findById(task._id).populate([
        { path: "birdId", select: "birdId" },
        { path: "coupleId", select: "coupleId" },
      ]);
      description = `A treatment task ${
        task.birdId ? `for bird ${populatedTask.birdId.birdId}` : ""
      }${
        task.coupleId ? ` for couple ${populatedTask.coupleId.coupleId}` : ""
      } has been completed by ${
        task.workerId ? worker.fullName : owner.firstName
      }`;
      break;
    case "nutritionTask":
      populatedTask = await Tasks.findById(task._id).populate([
        { path: "birdId", select: "birdId" },
        { path: "coupleId", select: "coupleId" },
      ]);
      description = `A nutrition task ${
        task.birdId ? "for bird " + populatedTask.birdId.birdId : ""
      }${
        task.coupleId
          ? " and for couple " + populatedTask.coupleId.coupleId
          : ""
      } has been completed by ${
        task.workerId ? worker.fullName : owner.firstName
      }`;
      break;
    case "externalFeedingTask":
      populatedTask = await Tasks.findById(task._id).populate({
        path: "eggBirdId",
        select: "birdId birdName eggId",
      });
      description = `Early Feeding task of ${
        populatedTask.eggBirdId.birdId
      } has been completed by ${
        task.workerId ? worker.fullName : owner.firstName
      }`;
      break;
    case "birdRecordTask":
      populatedTask = await Tasks.findById(task._id).populate({
        path: "eggBirdId",
        select: "birdId birdName eggId",
      });
      description = `Bird Record task of ${
        populatedTask.eggBirdId.birdId
      } has been completed by ${
        task.workerId ? worker.fullName : owner.firstName
      }`;
      break;
    default:
      description = "Unknown task type.";
      break;
  }

  data.description = description;

  if (token) {
    try {
      await sendNotification({
        recipientToken: token,
        title,
        body,
        data,
        silent: false,
      });
      console.log("Messages were sent successfully for task", task._id);
    } catch (error) {
      console.log("Error sending message for task", task._id, ":", error);
    }
  } else {
    console.log("No token found for owner:", owner.name);
  }
};

// DELETE TASKS
const DeleteTasks = async (req, res, next) => {
  try {
    const tasks = await Tasks.findByIdAndDelete(req.params.id);
    return res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

const SendAllTasks = async (req, res, next) => {
  console.log(req.params);
  try {
    let tasks;

    if (
      req.query.params === "birdRecord" ||
      req.query.params === "earlyFeeding"
    ) {
      tasks = await Tasks.find({
        eggBirdId: { $exists: true, $ne: null },
      })
        .populate({
          path: "eggBirdId",
          select:
            "birdId birdSpecie birdName eggID cageNumber farm birdId gender birthDate exactBirthDate status source price imageURL couple ringNumber ",
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
                      select: "imageURL",
                    },
                    {
                      path: "maleBird",
                      select: "imageURL",
                    },
                  ],
                },
              },
            },
            {
              path: "farm",
              select: "farmName _id farmType",
            },
            {
              path: "birdSpecie",
              select: "_id name specieType",
            },
            {
              path: "couple",
              select: "_id coupleId",
            },
          ],
        })
        .populate({
          path: "eggBirdId.farm",
          select: "_id farmType farmName",
        })
        .populate({
          path: "user",
          select: "firstName",
        });
      console.log("birdRecord");

      console.log(tasks);
    } else if (req.query.params === "treatment") {
      console.log("Medical task");
      tasks = await Tasks.find({
        $or: [
          { treatmentId: { $exists: true, $ne: null } },
          { birdId: { $exists: true, $ne: null } },
          { coupleId: { $exists: true, $ne: null } },
        ],
        // This condition checks for tasks where birdId exists and is not null.
      });

      for (let task of tasks) {
        // Initialize an array to hold populate options
        const populateOptions = [];

        // Check if treatmentId exists and push its populate option
        if (task.treatmentId) {
          populateOptions.push({
            path: "treatmentId",
            select: "treatmentStartDate treatmentName",
            // Add more populate options here if needed
          });

          if (task.birdId) {
            populateOptions.push({
              path: "birdId",
              // Specify select fields if needed, e.g., 'name age'
            });
          }

          // Check if coupleId exists and push its populate option
          if (task.coupleId) {
            populateOptions.push({
              path: "coupleId",
              // Specify select fields if needed
            });
          }
        }

        if (populateOptions.length > 0) {
          console.log("Medical task222");
          populateOptions.push({
            path: "user",
            select: "firstName",
          });
          populateOptions.push({
            path: "farm",
            select: "farmName",
            // Specify select fields if needed
          });
          await Tasks.populate(task, populateOptions);
        }
      }
    } else if (req.query.params === "nutrition") {
      console.log("Nutrition task");
      tasks = await Tasks.find({
        $or: [
          { nutritionId: { $exists: true, $ne: null } },
          // { birdId: { $exists: true, $ne: null } },
          // { coupleId: { $exists: true, $ne: null } }
        ],
        // This condition checks for tasks where birdId exists and is not null.
      });

      for (let task of tasks) {
        // Initialize an array to hold populate options
        const populateOptions = [];

        // Check if treatmentId exists and push its populate option
        if (task.nutritionId) {
          populateOptions.push({
            path: "nutritionId",
            // select: 'Date mealType',
            // Add more populate options here if needed
          });

          if (task.birdId) {
            populateOptions.push({
              path: "birdId",
              // Specify select fields if needed, e.g., 'name age'
            });
          }

          // Check if coupleId exists and push its populate option
          if (task.coupleId) {
            populateOptions.push({
              path: "coupleId",
              // Specify select fields if needed
            });
          }
        }

        if (populateOptions.length > 0) {
          populateOptions.push({
            path: "user",
            select: "firstName",
            // Specify select fields if needed
          });
          await Tasks.populate(task, populateOptions);
          console.log(task);
        }
      }
    } else if (
      req.query.params === "hatching" ||
      req.query.params === "fertility"
    ) {
      tasks = await Tasks.find({
        $or: [{ eggId: { $exists: true, $ne: null } }],
      })
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
                  select: "imageURL",
                },
                {
                  path: "maleBird",
                  select: "imageURL",
                },
              ],
            },
          },
        })
        .populate({
          path: "user",
          select: "firstName",
        });
    }
    return res.status(200).json(tasks);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  GetTasks,
  GetTasksByID,
  GetUserTasks,
  CreateTasks,
  UpdateTasks,
  DeleteTasks,
  SendAllTasks,
  SendCronMessage,
};
