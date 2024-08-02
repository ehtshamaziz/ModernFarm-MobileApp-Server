const Disease = require("../models/disease");
const Treatment = require("../models/treatment");

// GET ALL DISEASE
const GetDisease = async (req, res, next) => {
  console.log("Get all disease");
  try {
    const disease = await Disease.find();
    return res.status(200).send(disease);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE DISEASE
const GetDiseaseByID = async (req, res, next) => {
  try {
    const disease = await Disease.findById(req.params.id);
    return res.status(200).send(disease);
  } catch (err) {
    next(err);
  }
};

// GET ALL DISEASE FOR A SPECIFIC USER
const GetUserDisease = async (req, res, next) => {
  console.log("Get all user disease");
  try {
    const disease = await Disease.find({ user: req.params.id });
    return res.status(200).send(disease);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW DISEASE
const CreateDisease = async (req, res, next) => {
  const disease = new Disease(req.body);
  try {
    await disease.save();
    return res.status(200).json(disease);
  } catch (err) {
    next(err);
  }
};

// UPDATE DISEASE
const UpdateDisease = async (req, res, next) => {
  try {
    const disease = await Disease.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(disease);
  } catch (err) {
    next(err);
  }
};

// DELETE DISEASE
const DeleteDisease = async (req, res, next) => {
  try {
    const disease = await Disease.findByIdAndDelete(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }
    await Treatment.deleteMany({ diseaseSelection: req.params.id });
    return res.status(200).json(disease);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetDisease,
  GetDiseaseByID,
  GetUserDisease,
  CreateDisease,
  UpdateDisease,
  DeleteDisease,
};
