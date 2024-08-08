const Bird = require("../models/birds");
const Contact = require("../models/contact");

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
    const bird = await Bird.find({ birdOwner: req.params.id });
    console.log(bird,"HALO BIRD")
    if (bird) {
      return res.status(409).json(bird);
    } else {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      return res.status(200).json(contact);
    }
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
