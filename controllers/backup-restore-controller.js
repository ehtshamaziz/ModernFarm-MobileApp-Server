const Backup=require('../models/backup')
const User=require('../models/user')
const Bird=require('../models/birds')
const Couple=require('../models/couple')
const Product=require('../models/product')



// GET ALL BACKUP
const PostBackup = async (req, res, next) => {
  console.log("BACKUP!!");
      const userId = req.body.userId;

    try {
        const user = await User.findById(userId);
        const birds = await Bird.find({ user: userId });
        const couples = await Couple.find({ user: userId });
        const products = await Product.find({ user: userId });

        const backupData = new Backup({
            userId: user._id,
            userData: user,
            birdsData: birds,
            couplesData: couples,
            productsData: products
        });
        
        await backupData.save();
        res.status(200).send({ message: 'Backup successful' });
    } catch (error) {
        res.status(500).send({ message: 'Error creating backup', error });
    }
};

// GET SINGLE QUESTION
const PostRestore = async (req, res, next) => {
 const userId = req.body.userId;
    try {
        const backupData = await Backup.findOne({ userId });
        if (!backupData) {
            return res.status(404).send({ message: 'No backup found' });
        }

        await User.findByIdAndUpdate(userId, backupData.userData, { new: true });
        await Bird.deleteMany({ user: userId });
        await Bird.insertMany(backupData.birdsData);
        await Couple.deleteMany({ user: userId });
        await Couple.insertMany(backupData.couplesData);
        await Product.deleteMany({user:  userId });
        await Product.insertMany(backupData.productsData);

        res.status(200).send({ message: 'Restore successful' });
    } catch (error) {
        res.status(500).send({ message: 'Error restoring data', error });
    }
};



module.exports={
    PostBackup,
    PostRestore,
   


}