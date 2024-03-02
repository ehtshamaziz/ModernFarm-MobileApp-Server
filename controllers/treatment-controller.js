const Treatment = require("../models/treatment");

Treatment
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
  const treatment = new Treatment(req.body);
  try {
    await treatment.save();
    return res.status(200).json(treatment);
  } catch (err) {
    next(err);
  }
};


// UPDATE TREATMENT
const UpdateTreatment = async (req, res, next) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(treatment);
  } catch (err) {
    next(err);
  }
};

// DELETE TREATMENT
const DeleteTreatment = async (req, res, next) => {
  try {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    return res.status(200).json(treatment);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetTreatment,
  GetTreatmentByID,
  CreateTreatment,
  UpdateTreatment,
  DeleteTreatment,
  GetUserTreatment,
};
