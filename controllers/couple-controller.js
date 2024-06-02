const Couple = require("../models/couple");
const Clutch = require("../models/clutch");
const Bird = require("../models/birds");
const Egg = require("../models/egg");


const GetCouples = async (req, res, next) => {
  console.log("Get all couples");
  try {
    const couple = await Couple.find()
     .populate(
        "femaleBird",
        "_id birdName birdId gender price birdSpecie imageURL"
      )
      .populate(
        "maleBird",
        "_id birdName birdId gender price birdSpecie imageURL"
      )
      .populate("user","email firstName familyName")
      .populate("specie")
      .populate("farm", "farmType farmName _id")
      let couplesWithClutches = (await Promise.all(
      couple.map(async (couple) => {
      const clutchesCount = await Clutch.countDocuments({
      couple: couple._id,
      });
      console.log(clutchesCount);

      return { ...couple.toObject(), clutches: clutchesCount };
       })
       ))

    //   if (req.query.filterClutches === 'true') {
    //   couplesWithClutches = couplesWithClutches.filter(coupleWithClutch => coupleWithClutch.clutches > 0);
    // }
    
    // console.log(couplesWithClutches)
    return res.status(200).send(couplesWithClutches);
  } catch (err) {
    next(err);
  }
};

// GET SINGLE COUPLE
const GetCouplesByID = async (req, res, next) => {
  try {
    const couple = await Couple.findById(req.params.id)
    .populate("farm","farmName farmType")
    .populate("specie","name")
      .populate(
        "femaleBird",
        "_id birdName birdId gender price birdSpecie imageURL"
      )
      .populate(
        "maleBird",
        "_id birdName birdId gender price birdSpecie imageURL"
      )
    return res.status(200).send(couple);
  } catch (err) {
    next(err);
  }
};

// GET ALL COUPLE FOR A SPECIFIC USER
const GetUserCouples = async (req, res, next) => {
  console.log("Get all user couple");
  try {
    const couples = await Couple.find({ user: req.params.id })
      .populate(
        "femaleBird",
        "_id birdName birdId gender price birdSpecie imageURL"
      )
      .populate(
        "maleBird",
        "_id birdName birdId gender price birdSpecie imageURL"
      )
      .populate("farm", "farmType farmName _id")
      .populate("specie")
      .populate("user", "familyName firstName email")
      .populate("descendants","status")


      let couplesWithClutches = (await Promise.all(
      couples.map(async (couple) => {
      const clutchesCount = await Clutch.countDocuments({
      couple: couple._id,
      });
      console.log(clutchesCount);

      return { ...couple.toObject(), clutches: clutchesCount };
       })
       ))

      if (req.query.filterClutches === 'true') {
      couplesWithClutches = couplesWithClutches.filter(coupleWithClutch => coupleWithClutch.clutches > 0);
    }
    
    console.log(couplesWithClutches)
    return res.status(200).send(couplesWithClutches);
  } catch (err) {
    next(err);
  }
};

// GET ALL COUPLE FOR A SPECIFIC USER
const GetUserCalculateCouples = async (req, res, next) => {
  console.log("Get all user couple");
  try {
    const couples = await Couple.find({ user: req.params.id })
      .populate("femaleBird", "_id birdName birdId gender price birdSpecie imageURL")
      .populate("maleBird", "_id birdName birdId gender price birdSpecie imageURL")
      .populate("farm", "farmType farmName _id")
      .populate("specie")
      .populate("user", "familyName firstName email");
      couples.save();


    const couplesWithDetails = await Promise.all(couples.map(async (couple) => {
      const descendants =  couple.descendants;
      const eggs = await ParentCouplesEgg(couple._id);
      const clutchesCount = await Clutch.countDocuments({ couple: couple._id });

      const totalDescendants = descendants.length;
      const sumDescendants = descendants.length;
      const totalEggs = eggs.length;
      const fertilityEggs = eggs.filter(egg => egg.status === 'hatched' || egg.status === 'fertilized');
      const hatchingEggs = eggs.filter(egg => egg.status === 'hatched');

      let avgDeathRate = totalDescendants > 0 ? Math.min(((sumDescendants / totalDescendants) * 100).toFixed(2), 100) : 0;
      let avgFertility = totalEggs > 0 ? Math.min(((fertilityEggs.length / totalEggs) * 100).toFixed(2), 100) : 0;
      let avgHatching = totalEggs > 0 ? Math.min(((hatchingEggs.length / totalEggs) * 100).toFixed(2), 100) : 0;

      return {
        ...couple.toObject(),
        avgDeathRate,
        avgFertility,
        avgHatching,
        clutches: clutchesCount
      };
    }));

    if (req.query.filterClutches === 'true') {
      couplesWithDetails = couplesWithDetails.filter(couple => couple.clutches > 0);
    }

    console.log(couplesWithDetails);
    return res.status(200).json(couplesWithDetails);
  } catch (err) {
    console.error('Error in GetUserCalculateCouples:', err);
    next(err);
  }
};
async function ParentCouplesEgg(id) {
 try {
    const eggs = await Egg.find({parentCouple: id})  
    
    return (eggs);
  } catch (err) {
    console.log("Not Found ");
    next(err);
  }
}


// CREATE NEW COUPLE
const AddCouple = async (req, res, next) => {
  try {

    const {maleBird,femaleBird,cageNumber,status}=req.body;
    const existingCouple=await Couple.findOne({maleBird,femaleBird});
    await Bird.findByIdAndUpdate(maleBird,{
      cageNumber:cageNumber
    });
      await Bird.findByIdAndUpdate(femaleBird,{
      cageNumber:cageNumber
    });

    if(status==="separation"){
      const maleBirdToUpdate = await Bird.findById(maleBird);
      const femaleBirdToUpdate = await Bird.findById(maleBird);

      await Bird.findByIdAndUpdate(maleBird, {
      cageNumber: maleBirdToUpdate.initialCageNumber,
      status:"rest"
      });

      await Bird.findByIdAndUpdate(femaleBird, {
      cageNumber: femaleBirdToUpdate.initialCageNumber,
      status:"rest"
      });
    }
    else if(status==='deceased'){
        await Bird.findByIdAndUpdate(maleBird, {
       is_archived: true,
        status:"deceased"

      });

      await Bird.findByIdAndUpdate(femaleBird, {
      is_archived: true,
        status:"deceased"

      });

    }
    else if(status==='mating'){
      await Bird.findByIdAndUpdate(maleBird, {
        status:"mating"

      });
      await Bird.findByIdAndUpdate(femaleBird, {
        status:"mating"

      });
    }
    else if(status==='rest'){
      await Bird.findByIdAndUpdate(maleBird, {
        status:"rest"

      });
      await Bird.findByIdAndUpdate(femaleBird, {
        status:"rest"

      });
    }
    else if(status==='sold'){
      await Bird.findByIdAndUpdate(maleBird, {
        status:"sold"

      });
      await Bird.findByIdAndUpdate(femaleBird, {
        status:"sold"

      });
    }




    if (existingCouple) {
      return res.status(300).json({ message: "This male and female bird couple already exists." });
    }
  
    const lastCouple = await Couple.findOne({}, {}, { sort: { coupleId: -1 } });
    let coupleId = "COUPLE-001";


    if (lastCouple && lastCouple.coupleId) {
      const lastId = parseInt(lastCouple.coupleId.split("-")[1]);
      const newId = lastId + 1;
      const paddedId = String(newId).padStart(3, '0'); 
      coupleId = `COUPLE-${paddedId}`;
    }

    const couple = new Couple({ ...req.body, coupleId });
    await couple.save();

    return res.status(200).json(couple);
  } catch (err) {
    next(err);
  }
};

// UPDATE COUPLE
const UpdateCouple = async (req, res, next) => {
  try {
     const {maleBird,femaleBird,cageNumber,status}=req.body;

    const couple = await Couple.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      
    });
    await Bird.findByIdAndUpdate(maleBird,{
    cageNumber:cageNumber
    });
    await Bird.findByIdAndUpdate(femaleBird,{
      cageNumber:cageNumber
    });
  if(status === 'separation'){
      const maleBirdToUpdate = await Bird.findById(maleBird);
      const femaleBirdToUpdate = await Bird.findById(femaleBird);
      // console.log("sssssssssssssss");
      // console.log(cageNumber);
      // maleBirdToUpdate.set({
      // cageNumber: "newCageNumber", // Ensure this is a valid string
      // status: "rest"
      // });
      // // maleBirdToUpdate.cageNumber="1111";
      // // maleBirdToUpdate.status="rest";

      // femaleBirdToUpdate.cageNumber=femaleBirdToUpdate.initialCageNumber;
      // femaleBirdToUpdate.status="rest";
      // await maleBirdToUpdate.save();
      // await femaleBirdToUpdate.save();




    const maleUpdate=await Bird.findByIdAndUpdate(maleBird, {
       cageNumber: maleBirdToUpdate.initialCageNumber,
       status:"rest"
    },{ new: true });

    console.log(maleUpdate)
    
    // const femaleUpdate= 
     await Bird.findByIdAndUpdate(femaleBird, {
      cageNumber: femaleBirdToUpdate.initialCageNumber,
      status:"rest"
    },{ new: true });

  } else if(status === 'mating'){
      await Bird.findByIdAndUpdate(maleBird, {
        status:"mating"

      });
      await Bird.findByIdAndUpdate(femaleBird, {
        status:"mating"

      });
    }
    else if(status==='rest'){
      await Bird.findByIdAndUpdate(maleBird, {
        status:"rest"

      });
      await Bird.findByIdAndUpdate(femaleBird, {
        status:"rest"

      });
    }
    else if(status==='deceased'){
      await Bird.findByIdAndUpdate(maleBird, {
      is_archived: true,
      status:"deceased"

      });

      await Bird.findByIdAndUpdate(femaleBird, {
      is_archived: true,
      status:"deceased"

      });

  }
    else if(status==='sold'){
      await Bird.findByIdAndUpdate(maleBird, {
        status:"rest",
        is_archived:true,
        inMarket:false

      });
      await Bird.findByIdAndUpdate(femaleBird, {
        status:"rest",
        is_archived:true,
        inMarket:false
      });
    }


    return res.status(200).json(couple);
  } catch (err) {
    next(err);
  }
};

// DELETE COUPLE
const DeleteCouple = async (req, res, next) => {
  try {
    const couple = await Couple.findByIdAndDelete(req.params.id);
    return res.status(200).json(couple);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetCouples,
  GetCouplesByID,
  AddCouple,
  GetUserCouples,
  UpdateCouple,
  DeleteCouple,
  GetUserCalculateCouples
};
