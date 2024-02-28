const Couple = require("../models/couple");
const Clutch = require("../models/clutch");
const Bird = require("../models/birds");


const GetCouples = async (req, res, next) => {
  console.log("Get all couples");
  try {
    const couple = await Couple.find();
    return res.status(200).send(couple);
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


    console.log("tattttiiii");

      console.log(maleBirdToUpdate.initialCageNumber);

    const maleUpdate=await Bird.findByIdAndUpdate(maleBird, {
       cageNumber: "111111111",
       status:"rest"
    },{ new: true });

    console.log(maleUpdate)
    
    const femaleUpdate=  await Bird.findByIdAndUpdate(femaleBird, {
      cageNumber: femaleBirdToUpdate.initialCageNumber,
      status:"rest"
    },{ new: true });
    console.log(femaleUpdate)

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
        status:"sold"

      });
      await Bird.findByIdAndUpdate(femaleBird, {
        status:"sold"

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
};
