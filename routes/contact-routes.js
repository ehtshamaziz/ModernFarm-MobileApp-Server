const express = require("express");
const contactController = require("../controllers/contact-controller");
const router = express.Router();

// CONTACT ROUTES

// GET ALL CONTACTS
router.get("/", contactController.GetContacts);

// GET CONTACT BY ID
router.get("/single/:id", contactController.GetContactByID);

// CREATE NEW CONTACT
router.post("/", contactController.CreateContact);

// UPDATE CONTACT BY ID
router.patch("/:id", contactController.UpdateContact);

// DELETE CONTACT BY ID
router.delete("/:id", contactController.DeleteContact);

module.exports = router;
