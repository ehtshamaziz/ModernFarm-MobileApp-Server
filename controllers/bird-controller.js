const Bird = require("../models/birds");
const Couple = require("../models/couple");
const Egg = require("../models/egg");
const Task = require("../models/tasks");
const Market = require("../models/market");
const Nutrition = require("../models/nutrition");
const Finance = require("../models/finance");
const Treatment = require("../models/treatment");
const Clutch = require("../models/clutch");

const GetBirds = async (req, res, next) => {
  console.log("Get all birds");
  try {
    const bird = await Bird.find()
      .populate({
        path: "user",
        select: "_id firstName familyName",
      })
      .populate({
        path: "farm",
        select: "farmName farmType",
      })
      .populate({
        path: "birdOwner",
        select: "firstName lastName",
      })
      .populate({
        path: "birdSpecie",
        select: "name",
      });
    return res.status(200).send(bird);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE BIRD
const GetBirdsByID = async (req, res, next) => {
  try {
    const bird = await Bird.findById(req.params.id);
    return res.status(200).send(bird);
  } catch (err) {
    next(err);
  }
};

// GET ALL BIRD FOR A SPECIFIC USER
const GetUserBirds = async (req, res, next) => {
  console.log("Get all user bird");
  try {
    const bird = await Bird.find({ user: req.params.id })
      .populate("farm", "farmType farmName _id")
      .populate("user", "familyName firstName email")
      .populate("couple", "coupleId")
      .populate("birdSpecie", "_id name")
      .populate("birdOwner", "_id firstName lastName");
    console.log(bird);
    return res.status(200).send(bird);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW BIRD
const AddBirds = async (req, res, next) => {
  try {
    const data = req.body;

    const lastBird = await Bird.findOne({}, {}, { sort: { birdId: -1 } });
    let birdId = "BIRD-001";

    if (lastBird && lastBird.birdId) {
      const lastId = parseInt(lastBird.birdId.split("-")[1]);
      const newId = lastId + 1;
      const paddedId = String(newId).padStart(3, "0");
      birdId = `BIRD-${paddedId}`;
    }

    if (data.source === "outsideFarm") {
      createExpense(data, birdId);
    }

    const bird = new Bird({ ...data, birdId });
    await bird.save();

    if (req.body.couple) {
      const coupleId = req.body.couple;
      console.log(coupleId);
      try {
        const updatedCouple = await Couple.findByIdAndUpdate(
          coupleId,
          { $push: { descendants: bird._id } },
          { new: true }
        );
        console.log(updatedCouple);
      } catch (error) {
        console.error("Error updating Couple document:", error);
      }
    }
    if (req.body.eggID) {
      try {
        console.log(req.body.eggID);

        const birds = await Bird.findById(bird._id).populate({
          path: "eggID", // Direct reference in Bird
          populate: {
            path: "clutch", // Nested reference in Egg
            populate: {
              path: "couple", // Nested reference in Clutch
              populate: {
                path: "specie", // Further nested reference in Couple
                select: "incubation startFeedingAfter addRingAfter", // Select necessary fields from Specie
              },
            },
          },
        });

        const hatchingDate = new Date(birds.eggID.eggsLaidDate);
        const incubationDays = birds.eggID?.clutch.couple.specie.incubation;
        hatchingDate.setDate(hatchingDate.getDate() + incubationDays);

        const earlyStageFeedingDays =
          birds.eggID?.clutch.couple.specie.startFeedingAfter;
        const earlyStageFeedingDate = new Date(hatchingDate);
        earlyStageFeedingDate.setDate(
          earlyStageFeedingDate.getDate() + (earlyStageFeedingDays || 0)
        );

        const birdRecordAfterDays =
          birds.eggID?.clutch.couple.specie.addRingAfter;
        const birdRecordAfterDate = new Date(hatchingDate);
        birdRecordAfterDate.setDate(
          birdRecordAfterDate.getDate() + (birdRecordAfterDays || 0)
        );

        await Egg.findByIdAndUpdate(
          req.body.eggID,
          { $set: { birdID: bird._id } },
          { new: true }
        );
        const task = new Task({
          eggBirdId: bird._id,
          user: bird.user,
          farm: bird.farm,
          taskType: "birdRecordTask",
          taskDate: birdRecordAfterDate,
        });
        const task2 = new Task({
          eggBirdId: bird._id,
          user: bird.user,
          farm: bird.farm,
          taskType: "earlyFeedingTask",
          taskDate: earlyStageFeedingDate,
        });
        await task.save();
        await task2.save();
      } catch (error) {
        console.log(error);
      }
    }

    return res.status(200).json(bird);
  } catch (err) {
    next(err);
  }
};

const createExpense = async (data, birdId) => {
  const expense = new Finance({
    farm: data.farm,
    user: data.user,
    financeCategory: "costOfBird",
    financeType: "expense",
    amount: data.price,
    date: new Date(),
    description: birdId,
  });
  await expense.save();
};

// UPDATE BIRD
const UpdateBird = async (req, res, next) => {
  try {
    const { status } = req.body;

    const bird = await Bird.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    await bird.save();

    if (status === "deceased") {
      const coupleBird = await Couple.findOne({
        $or: [{ maleBird: bird._id }, { femaleBird: bird._id }],
      });

      // If a matching couple is found, update its status
      if (coupleBird) {
        const couples = await Couple.findByIdAndUpdate(coupleBird._id, {
          is_archived: true,
          status: "separation",
        });
        couples.save();
      }
      const otherBirdId = coupleBird.maleBird.equals(bird._id)
        ? coupleBird.femaleBird
        : coupleBird.maleBird;
      const birds = await Bird.findByIdAndUpdate(otherBirdId, {
        status: "rest",
      });

      birds.save();
    }

    return res.status(200).json(bird);
  } catch (err) {
    next(err);
  }
};

// DELETE BIRD
const DeleteBird = async (req, res, next) => {
  try {
    const bird = await Bird.findByIdAndDelete(req.params.id);

    if (!bird) {
      return res.status(404).json({ message: "Bird not found" });
    }

    const couple = await Couple.findOne({
      $or: [{ maleBird: req.params.id }, { femaleBird: req.params.id }],
    });

    if (couple) {
      const clutch = await Clutch.findOne({ couple: couple._id });
      await Egg.deleteMany({ clutch: clutch._id });

      await Clutch.deleteMany({ couple: couple._id });
      await Couple.deleteMany({
        $or: [{ maleBird: req.params.id }, { femaleBird: req.params.id }],
      });
    }

    await Task.deleteMany({
      $or: [{ eggBirdId: req.params.id }, { birdId: req.params.id }],
    });
    await Market.deleteMany({
      bird: req.params.id,
    });
    await Treatment.deleteMany({ bird: { $in: [req.params.id] } });

    await Nutrition.deleteMany({ bird: { $in: [req.params.id] } });

    return res.status(200).json(bird);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetBirds,
  GetBirdsByID,
  AddBirds,
  GetUserBirds,
  UpdateBird,
  DeleteBird,
};
