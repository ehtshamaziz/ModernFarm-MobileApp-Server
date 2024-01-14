const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: String,
  familyName: String,
  phoneNumber:Number,
  countryCode: String,
 password: { type: String, required: true },
  imageURL: {
    type: String,
    default:
      "https://res.cloudinary.com/dqnz3rzt5/image/upload/v1679141386/avatar_sofpb7.jpg",
  },
  googleId: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Customer", customerSchema);
