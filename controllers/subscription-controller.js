const Subscription=require('../models/subscription')


// GET ALL SUBSCRIPTION
const GetSubscription = async (req, res, next) => {
  console.log("Get all subscription");
  try {
    const subscription = await Subscription.find();
    return res.status(200).send(subscription);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE SUBSCRIPTION
const GetSubscriptionByID = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    return res.status(200).send(subscription);
  } catch (err) {
    next(err);
  }
};

// GET ALL SUBSCRIPTION FOR A SPECIFIC USER
const GetUserSubscription = async (req, res, next) => {
  console.log("Get all user subscription");
  try {
    const subscription = await Subscription.find({ user: req.params.id });
    return res.status(200).send(subscription);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW SUBSCRIPTION
const CreateSubscription = async (req, res, next) => {
  const subscription = new Subscription(req.body);
  try {
    await subscription.save();
    return res.status(200).json(subscription);
  } catch (err) {
    next(err);
  }
};

// UPDATE SUBSCRIPTION
const UpdateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json(subscription);
  } catch (err) {
    next(err);
  }
};

// DELETE SUBSCRIPTION
const DeleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    return res.status(200).json(subscription);
  } catch (err) {
    next(err);
  }
};


module.exports={
    GetSubscription,
    GetSubscriptionByID,
    GetUserSubscription,
    CreateSubscription,
    UpdateSubscription,
    DeleteSubscription


}