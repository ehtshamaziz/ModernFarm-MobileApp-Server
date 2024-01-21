const Contact = require("../models/contact");
// const cloudinary = require("cloudinary").v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

//        ********** FUNCTIONS ***********

// GET ALL CONTACTS
const GetContacts = async (req, res, next) => {
  console.log("Get all contacts");
  try {
    const contact = await Contact.find();
    return res.status(200).send(contact);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE CONTACT
const GetContactByID = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    return res.status(200).send(contact);
  } catch (err) {
    next(err);
  }
};

// GET ALL CONTACTS FOR A SPECIFIC USER
const GetUserContacts = async (req, res, next) => {
  console.log("Get all user contacts");
  try {
    const contacts = await Contact.find({ user: req.params.id });
    return res.status(200).send(contacts);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW CONTACT
const CreateContact = async (req, res, next) => {
  const contact = new Contact(req.body);
  try {
    await contact.save();
    return res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};

// UPDATE CONTACT
const UpdateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};

// DELETE CONTACT
const DeleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    return res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetContacts,
  GetContactByID,
  CreateContact,
  UpdateContact,
  DeleteContact,
  GetUserContacts,
};
