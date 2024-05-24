const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  imageURL: {
    type: String,
    default:
      "https://res.cloudinary.com/dqnz3rzt5/image/upload/v1679141386/avatar_sofpb7.jpg",
  },
  planName: { type: String, required: true },
  planeTenure: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  discountedPrice: { type: Number },
  currency: [{ type: String, required: true }],
  country: [{ type: String, required: true }],
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],

  accessRights: {
    all: { type: Boolean, default: true },
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


});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
