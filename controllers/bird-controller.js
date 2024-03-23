const Bird = require("../models/birds");
const Couple=require("../models/couple");
const Egg=require("../models/egg");
const Task=require("../models/tasks");
const User= require("../models/user");
const Worker=require("../models/workers");

    var admin = require('firebase-admin');




const GetBirds = async (req, res, next) => {
  console.log("Get all birds");
  try {
    const bird = await Bird.find()
  .populate({
    path: 'farm',
    select: 'farmName farmType'
  })
  .populate({
    path: 'birdOwner',
    select: 'firstName lastName'
  })
  .populate({
    path: 'birdSpecie',
    select: 'name'
  });

    return res.status(200).send(bird);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE BIRD
const GetBirdsByID = async (req, res, next) => {
  try {
    const bird = await Bird.findById(req.params.id);
    return res.status(200).send(bird);
  } catch (err) {
    next(err);
  }
};

// GET ALL BIRD FOR A SPECIFIC USER
const GetUserBirds = async (req, res, next) => {
  console.log("Get all user bird");
  try {
    const bird = await Bird.find({ user: req.params.id })
      .populate("farm", "farmType farmName _id")
      .populate("couple","coupleId")
      .populate("birdSpecie","_id name")
      .populate("birdOwner", "_id firstName lastName");
    console.log(bird);
    return res.status(200).send(bird);
  } catch (err) {
    next(err);
  }
};

// CREATE NEW BIRD
const AddBirds = async (req, res, next) => {
  try {
    const  data = req.body;
    console.log(data)
    console.log("ssssssssssssssssssssssssfffffffffffffffffffff")
  
    const lastBird = await Bird.findOne({}, {}, { sort: { birdId: -1 } });
    let birdId = "BIRD-001";

    if (lastBird && lastBird.birdId) {
      const lastId = parseInt(lastBird.birdId.split("-")[1]);
      const newId = lastId + 1;
      const paddedId = String(newId).padStart(3, '0'); 
      birdId = `BIRD-${paddedId}`;
    }
    const bird = new Bird({...data, birdId });
    await bird.save();


    if (req.body.couple) {
  
      const coupleId = req.body.couple; 
      console.log(coupleId);
    try {
      const updatedCouple = await Couple.findByIdAndUpdate(coupleId, 
      { $push: { descendants: bird._id } }, 
      { new: true } 
    );
    console.log(updatedCouple);
      } catch (error) {
  
    console.error("Error updating Couple document:", error);
  }
}
    if(req.body.eggID){
    try{
      console.log(req.body.eggID);
      await Egg.findByIdAndUpdate(req.body.eggID,{$set:{birdID:bird._id}},{ new: true })
     const task=new Task({eggBirdId: bird._id,user:bird.user,farm:bird.farm,taskType:'birdRecord'});
     const task2=new Task({eggBirdId: bird._id,user:bird.user,farm:bird.farm,taskType:'earlyFeeding'});
     await task.save();
     await task2.save();
     await sendMessage(task);
     await sendMessage(task2);


    } catch (error) {
      console.log(error);
    }
  }
 

    return res.status(200).json(bird);
  } catch (err) {
    next(err);
  }
};






async function getTokensFromDatastore(userId) {
  try {
    // Assuming your DeviceToken fmodel has a `userId` field
    const tokensData = await User.find({ _id: userId }).exec();
    const tokens = tokensData.map(tokenDoc => tokenDoc.token);
    console.log(tokens)
    return tokens;
  } catch (error) {
    console.error('Failed to fetch tokens from datastore:', error);
    throw error; // Rethrow the error to handle it in the calling context
  }
}

   async function sendMessage(task) {
  // Fetch workers who are eligible for fertilityTest notifications
  const workers = await Worker.find({
    farm: task.farm,
    $or:[
      {    'notificationRights.externalFeeding': true
},
  {    'notificationRights.ringNumber': true
},
    ]
  }).exec(); // Make sure to await the query


  // For each worker, fetch their device token and send a notification
  for (const worker of workers) {
    const tokens = await getTokensFromDatastore(worker._id); // Assuming worker.userId exists and corresponds to userId in Device

    console.log("Tokensss");
    console.log(tokens)
    if (tokens.length > 0) {
      console.log("Sending message to", worker._id);
      const response = await admin.messaging().sendMulticast({
        tokens, // Array of device tokens
        data: { hello: 'world!' }, // Your data payload
      });
      console.log(response); // Log the response from sending the message
    }
  }
}


// UPDATE BIRD
const UpdateBird = async (req, res, next) => {
  try {
    const {status}=req.body;

    const bird = await Bird.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    await bird.save();
  
    // if(req.body.eggID){
    //  await Egg.findByIdAndUpdate(req.body.eggID,{$set:{birdID:bird._id}},{ new: true })
    //  const task=new Task({birdId: bird._id,user:bird.user,farm:bird.farm});
    //  await task.save();

    // }
    if(status==="deceased"){

        const coupleBird = await Couple.findOne({
      $or: [
        { maleBird: bird._id },
        { femaleBird: bird._id }
      ]
    });

    // If a matching couple is found, update its status
    if (coupleBird) {
      const couples=await Couple.findByIdAndUpdate(coupleBird._id, {
        is_archived: true,
        status: "separation"
      });
    couples.save();

    }
    const otherBirdId = coupleBird.maleBird.equals(bird._id) ? coupleBird.femaleBird : coupleBird.maleBird;
    const birds= await Bird.findByIdAndUpdate(otherBirdId,{
       status:"rest"

    });

  birds.save();
}

    return res.status(200).json(bird);
  } catch (err) {
    next(err);
  }
};



// DELETE BIRD
const DeleteBird = async (req, res, next) => {
  try {
    const bird = await Bird.findByIdAndDelete(req.params.id);
    return res.status(200).json(bird);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetBirds,
  GetBirdsByID,
  AddBirds,
  GetUserBirds,
  UpdateBird,
  DeleteBird,
};
