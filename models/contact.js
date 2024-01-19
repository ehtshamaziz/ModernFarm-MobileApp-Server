const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  category: { type: String, required: true },
  location: {
    text: { type: String, required: true },
    link: { type: String },
  },
  mobileNumber: { type: String, required: true },
  email: { type: String },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
