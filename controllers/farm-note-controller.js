const FarmNote=require('../models/farm-note')


// GET ALL FARM-NOTE
const GetFarmNote = async (req, res, next) => {
  console.log("Get all farmNote");
  try {
    const farmNote = await FarmNote.find().populate("farm", "farmName farmType _id");
    return res.status(200).send(farmNote);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE FARM-NOTE
const GetFarmNoteByID = async (req, res, next) => {
  try {
    const farmNote = await FarmNote.findById(req.params.id);
    return res.status(200).send(farmNote);
  } catch (err) {
    next(err);
  }
};

// GET ALL FARM-NOTE FOR A SPECIFIC USER
const GetUserFarmNote = async (req, res, next) => {
  console.log("Get all user farmNote");
  try {
    const farmNote = await FarmNote.find({ user: req.params.id }).populate("farm", "farmName farmType _id");
    return res.status(200).send(farmNote);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW FARM-NOTE
const CreateFarmNote = async (req, res, next) => {
  const farmNote = new FarmNote(req.body);
  try {
    await farmNote.save();
    return res.status(200).json(farmNote);
  } catch (err) {
    next(err);
  }
};

// UPDATE FARM-NOTE
const UpdateFarmNote = async (req, res, next) => {
  try {
    const farmNote = await FarmNote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(farmNote);
  } catch (err) {
    next(err);
  }
};

// DELETE FARM-NOTE
const DeleteFarmNote = async (req, res, next) => {
  try {
    const farmNote = await FarmNote.findByIdAndDelete(req.params.id);
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