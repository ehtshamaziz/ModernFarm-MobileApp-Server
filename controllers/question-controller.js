const Question=require('../models/question')


// GET ALL QUESTION
const GetQuestion = async (req, res, next) => {
  console.log("Get all question");
  try {
    const question = await Question.find();
    return res.status(200).send(question);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE QUESTION
const GetQuestionByID = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    return res.status(200).send(question);
  } catch (err) {
    next(err);
  }
};

// GET ALL QUESTION FOR A SPECIFIC USER
const GetUserQuestion = async (req, res, next) => {
  console.log("Get all user question");
  try {
    const question = await Question.find({ user: req.params.id });
    return res.status(200).send(question);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW QUESTION
const CreateQuestion = async (req, res, next) => {
  const question = new Question(req.body);
  try {
    await question.save();
    return res.status(200).json(question);
  } catch (err) {
    next(err);
  }
};

// UPDATE QUESTION
const UpdateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(question);
  } catch (err) {
    next(err);
  }
};

// DELETE QUESTION
const DeleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    return res.status(200).json(question);
  } catch (err) {
    next(err);
  }
};


module.exports={
    GetQuestion,
    GetQuestionByID,
    GetUserQuestion,
    CreateQuestion,
    UpdateQuestion,
    DeleteQuestion


}