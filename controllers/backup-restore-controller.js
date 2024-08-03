const Backup = require("../models/backup");
const User = require("../models/user");
const Bird = require("../models/birds");
const Couple = require("../models/couple");
const Product = require("../models/product");
const Treatment = require("../models/treatment");
const Disease = require("../models/disease");
const FarmNote = require("../models/farm-note");
const Finance = require("../models/finance");
const Nutrition = require("../models/nutrition");
const Task = require("../models/tasks");
const Market = require("../models/market");
const Worker = require("../models/workers");
const Farm = require("../models/farm");
const Contact = require("../models/contact");
const Clutch = require("../models/clutch");
const Egg = require("../models/egg");

const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const mongoose = require("mongoose");

// GET BACKUP URLS
const GetUserBackups = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ backups: user.backupUrls });
  } catch (error) {
    res.status(500).send({ message: "Error fetching backups", error });
  }
};

// POST BACKUP
const PostBackup = async (req, res, next) => {
  console.log("BACKUP!!");
  const userId = req.body.userId;
  const backupType = req.body.backupType; // 'cloud' or 'local'

  try {
    const user = await User.findById(userId);

    if (user.backupUrls.length >= 100) {
      return res.status(406).send({ message: "Backup limit reached" });
    }
    const birds = await Bird.find({ user: userId });
    const couples = await Couple.find({ user: userId });
    const products = await Product.find({ user: userId });
    const treatments = await Treatment.find({ user: userId });
    const disease = await Disease.find({ user: userId });
    const farmNote = await FarmNote.find({ user: userId });
    const finance = await Finance.find({ user: userId });
    const nutrition = await Nutrition.find({ user: userId });
    const task = await Task.find({ user: userId });
    const market = await Market.find({ user: userId });
    const worker = await Worker.find({ user: userId });
    const farm = await Farm.find({ user: userId });
    const contact = await Contact.find({ user: userId });
    const clutch = await Clutch.find({ user: userId });
    const egg = await Egg.find({ user: userId });

    // Create new backup data
    const backupData = {
      userId: user._id,
      userData: user,
      birdsData: birds,
      couplesData: couples,
      productsData: products,
      treatmentsData: treatments,
      diseasesData: disease,
      farmNotesData: farmNote,
      financesData: finance,
      nutritionsData: nutrition,
      tasksData: task,
      marketsData: market,
      workersData: worker,
      farmsData: farm,
      contactsData: contact,
      clutchesData: clutch,
      eggsData: egg,
    };

    console.log("LOCAL BEFORE CHECKING", backupType);
    if (backupType === "cloud") {
      const timestamp = Date.now(); // Generate timestamp once
      const backupFileName = `${userId}_${timestamp}.json`;
      const backupFilePath = path.join(__dirname, backupFileName);
      console.log(backupFilePath,"File Path")
      console.log(backupData,"Backup Data")
      fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));

      const result = await cloudinary.uploader.upload(backupFilePath, {
        resource_type: "raw",
        public_id: `backup_${userId}_${timestamp}`,
      });
      console.log(result,"HAHHAHA")

      user.backupUrls.push(result.secure_url);
      await user.save();
      console.log("After saving")

      // Clean up local backup file
      fs.unlinkSync(backupFilePath);

      res.status(200).send({ message: "Backup successful (cloud)" });
    } else if (backupType === "local") {
      console.log("before local response");
      res
        .status(200)
        .send({ message: "Backup successful (local)", backupData });
    } else {
      // If backupType is not specified or invalid, respond with an error
      fs.unlinkSync(backupFilePath); // Clean up the file if it was created
      res.status(400).send({ message: "Invalid backup type" });
    }
    // res.status(200).send({ message: 'Backup successful' ``});
  } catch (error) {
    res.status(500).send({ message: "Error creating backup", error });
  }
};

const PostRestore = async (req, res, next) => {
  const userId = req.body.userId;
  const backupUrl = req.body.backupUrl;
  const backupData = req.body.backupData; // Added to handle local restore
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send({ message: "User not found" });
    }

    let dataToRestore;

    if (backupUrl) {
      // Cloud Restore
      const response = await axios.get(backupUrl);
      dataToRestore = response.data;
    } else if (backupData) {
      // Local Restore
      dataToRestore = backupData;
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ message: "No backup data provided" });
    }

    // Restore data to the corresponding collections
    await User.updateOne({ _id: userId }, dataToRestore.userData).session(session);
    await Bird.deleteMany({ user: userId }).session(session);
    await Bird.insertMany(dataToRestore.birdsData, { session });
    await Couple.deleteMany({ user: userId }).session(session);
    await Couple.insertMany(dataToRestore.couplesData, { session });
    await Product.deleteMany({ user: userId }).session(session);
    await Product.insertMany(dataToRestore.productsData, { session });
    await Treatment.deleteMany({ user: userId }).session(session);
    await Treatment.insertMany(dataToRestore.treatmentsData, { session });
    await Disease.deleteMany({ user: userId }).session(session);
    await Disease.insertMany(dataToRestore.diseasesData, { session });
    await FarmNote.deleteMany({ user: userId }).session(session);
    await FarmNote.insertMany(dataToRestore.farmNotesData, { session });
    await Finance.deleteMany({ user: userId }).session(session);
    await Finance.insertMany(dataToRestore.financesData, { session });
    await Nutrition.deleteMany({ user: userId }).session(session);
    await Nutrition.insertMany(dataToRestore.nutritionsData, { session });
    await Task.deleteMany({ user: userId }).session(session);
    await Task.insertMany(dataToRestore.tasksData, { session });
    await Market.deleteMany({ user: userId }).session(session);
    await Market.insertMany(dataToRestore.marketsData, { session });
    await Worker.deleteMany({ user: userId }).session(session);
    await Worker.insertMany(dataToRestore.workersData, { session });
    await Farm.deleteMany({ user: userId }).session(session);
    await Farm.insertMany(dataToRestore.farmsData, { session });
    await Contact.deleteMany({ user: userId }).session(session);
    await Contact.insertMany(dataToRestore.contactsData, { session });
    await Clutch.deleteMany({ user: userId }).session(session);
    await Clutch.insertMany(dataToRestore.clutchesData, { session });
    await Egg.deleteMany({ user: userId }).session(session);
    await Egg.insertMany(dataToRestore.eggsData, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ message: "Backup restored successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ message: "Error restoring backup", error });
  }
};

const DeleteBackup = async (req, res, next) => {
  console.log("Selected Deleted");
  const userId = req.params.id;
  const { backupUrl } = req.body;

  try {
    const urlParts = backupUrl.split("/");
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const publicId = `${fileNameWithExtension}`;
    console.log("publicId:", publicId);

    // Delete the file from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });
    console.log("Cloudinary delete result:", result);

    if (result.result !== "ok") {
      return res
        .status(500)
        .send({ message: "Error deleting file from Cloudinary" });
    }
    // Remove the backup URL from the user's record
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.backupUrls = user.backupUrls.filter((url) => url !== backupUrl);
    await user.save();

    res.status(200).send({ message: "Backup deleted successfully" });
  } catch (error) {
    console.error("Error deleting backup:", error);
    res
      .status(500)
      .send({ message: "Error deleting backup", error: error.message });
  }
};

module.exports = {
  PostBackup,
  PostRestore,
  GetUserBackups,
  DeleteBackup,
};
