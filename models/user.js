const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: String,
  familyName: String,
  phoneNumber: String,
  password: { type: String, required: true },
  imageURL: {
    type: String,
    default:
      "https://res.cloudinary.com/dqnz3rzt5/image/upload/v1679141386/avatar_sofpb7.jpg",
  },
  country: {
    countryName: { type: String },
    countryFlag: { type: String },
    callingCode: { type: String },
    currency: { type: String },
  },

  accessRights: {
    species: { type: Boolean, default: true },
    myBirds: { type: Boolean, default: true },
    myCouples: { type: Boolean, default: true },
    nutrition: { type: Boolean, default: true },
    medicalCare: { type: Boolean, default: true },
    tasks: { type: Boolean, default: true },
    myWorkers: { type: Boolean, default: true },
    incomeExpenses: { type: Boolean, default: true },
    archives: { type: Boolean, default: true },
    reports: { type: Boolean, default: true },
    market: { type: Boolean, default: true },
    subscriptions: { type: Boolean, default: true },
    farmNotes: { type: Boolean, default: true },
    contacts: { type: Boolean, default: true },
    products: { type: Boolean, default: true },

    fertilityTask: { type: Boolean, default: true },
    hatchingTask: { type: Boolean, default: true },
    birdRecordTask: { type: Boolean, default: true },
    earlyFeedingTask: { type: Boolean, default: true },
    nutritionTask: { type: Boolean, default: true },
    medicalCareTask: { type: Boolean, default: true },
    settings: { type: Boolean, default: true },
  },
  otpVerification: {
    otp: { type: String },
    expiresAt: { type: Date },
  },
  reset: {
    otp: { type: String },
    expiresAt: { type: Date },
  },
    backups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Backup' }],

  dateCreated: {
    type: Date,
    default: Date.now,
  },
  userToken: { type: String },
  timezoneOffset :{type:Number},
    backupUrls: [
        {
            type: String,
            required: false
        }
    ]

});

module.exports = mongoose.model("User", userSchema);
