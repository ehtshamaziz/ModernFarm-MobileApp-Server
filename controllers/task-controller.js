const Tasks=require('../models/tasks')


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

    const tasks = await Tasks.find({ user: req.params.id });
    
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
    return res.status(200).json(tasks);
  } catch (err) {
    next(err);
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


module.exports={
    GetTasks,
    GetTasksByID,
    GetUserTasks,
    CreateTasks,
    UpdateTasks,
    DeleteTasks

}