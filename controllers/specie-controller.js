const Specie = require("../models/specie");

const PostSpecie = async (req, res, next) => {
  console.log("Post specie");
  const specie = new Specie(req.body);
  try {
    await specie.save();
    return res.status(200).json(specie);
  } catch (e) {
    next(e);
  }
};

const GetSpecies = async (req, res, next) => {
  console.log("Get all approved species");
  try {
    const species = await Specie.find({ approval: true });
    return res.status(200).json(species);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  PostSpecie,
  GetSpecies,
};
