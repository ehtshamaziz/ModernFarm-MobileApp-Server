const GeneralSetting=require('../models/general-setting')


// GET ALL GENERAL-SETTING
const GetGeneralSetting = async (req, res, next) => {
  console.log("Get all generalSetting");
  try {
    const generalSetting = await GeneralSetting.find();
    return res.status(200).send(generalSetting);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE GENERAL-SETTING
const GetGeneralSettingByID = async (req, res, next) => {
  try {
    const generalSetting = await GeneralSetting.findById(req.params.id);
    return res.status(200).send(generalSetting);
  } catch (err) {
    next(err);
  }
};

// GET ALL GENERAL-SETTING FOR A SPECIFIC USER
const GetUserGeneralSetting = async (req, res, next) => {
  console.log("Get all user generalSetting");
  try {
    const generalSetting = await GeneralSetting.find({ user: req.params.id });
    return res.status(200).send(generalSetting);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW GENERAL-SETTING
const CreateGeneralSetting = async (req, res, next) => {
  const generalSetting = new GeneralSetting(req.body);
  try {
    await generalSetting.save();
    return res.status(200).json(generalSetting);
  } catch (err) {
    next(err);
  }
};

// UPDATE GENERAL-SETTING
const UpdateGeneralSetting = async (req, res, next) => {
  try {
    const generalSetting = await GeneralSetting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(generalSetting);
  } catch (err) {
    next(err);
  }
};

// DELETE GENERAL-SETTING
const DeleteGeneralSetting= async (req, res, next) => {
  try {
    const generalSetting = await GeneralSetting.findByIdAndDelete(req.params.id);
    return res.status(200).json(generalSetting);
  } catch (err) {
    next(err);
  }
};


module.exports={
    GetGeneralSetting,
    GetGeneralSettingByID,
    GetUserGeneralSetting,
    CreateGeneralSetting,
    UpdateGeneralSetting,
    DeleteGeneralSetting


}