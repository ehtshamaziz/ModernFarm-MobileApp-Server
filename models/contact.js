const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  firstName: { type: String, required: true },
  lastName: { type: String },
  imageURL: { type: String },
  category: { type: String, required: true },
  location: {
    text: { type: String, required: true },
    link: { type: String },
  },
  phoneNumber: { type: String, required: true },
  country: {
    callingCode: { type: String, required: true },
    countryFlag: { type: String },
  },
  email: { type: String },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
