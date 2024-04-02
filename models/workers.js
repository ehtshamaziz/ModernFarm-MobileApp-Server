const mongoose = require("mongoose");

const workersSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
  email: { type: String, required: true, unique: true },
  fullName: String,
  phoneNumber: String,
  password: { type: String, required: true },
  imageURL: {
    type: String,
    default:
      "https://res.cloudinary.com/dqnz3rzt5/image/upload/v1679141386/avatar_sofpb7.jpg",
  },
  gender:{type:String},
  country: {
    countryName: { type: String },
    countryFlag: { type: String },
    callingCode: { type: String },
    currency: { type: String },
  },

  accessRights: {
    species: { type: Boolean, default: false },
    myBirds: { type: Boolean, default: false },
    myCouples: { type: Boolean, default: false },
    nutrition: { type: Boolean, default: false },
    medicalCare: { type: Boolean, default: false },
    tasks: { type: Boolean, default: true },
    myWorkers: { type: Boolean, default: false },
    incomeExpenses: { type: Boolean, default: false },
    archives: { type: Boolean, default: false },
    reports: { type: Boolean, default: false },
    market: { type: Boolean, default: false },
    subscriptions: { type: Boolean, default: false },
    farmNotes: { type: Boolean, default: false },
    contacts: { type: Boolean, default: false },
    products: { type: Boolean, default: false },
    settings: { type: Boolean, default: false },

    fertilityTask: { type: Boolean, default: false },
    hatchingTask: { type: Boolean, default: false },
    birdRecordTask: { type: Boolean, default: false },
    earlyFeedingTask: { type: Boolean, default: false },
    nutritionTask: { type: Boolean, default: false },
    medicalCareTask: { type: Boolean, default: false },
  },
  otpVerification: {
    otp: { type: String },
    expiresAt: { type: Date },
  },
  otpVerified:{type:Boolean, default:false},

//   reset: {
//     otp: { type: String },
//     expiresAt: { type: Date },
//   },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  notificationRights:{
    fertility:{type:Boolean, default:false},
    hatching:{type:Boolean, default:false},
    externalFeeding:{type:Boolean, default:false},
    ringNumber:{type:Boolean, default:false},
    medicine:{type:Boolean, default:false},
    nutrition:{type:Boolean, default:false},

  },
      token: { type: String},

});

module.exports = mongoose.model("Workers", workersSchema);
