const Backup=require('../models/backup')
const User=require('../models/user')
const Bird=require('../models/birds')
const Couple=require('../models/couple')
const Product=require('../models/product')
const Treatment=require('../models/treatment')
const Disease=require('../models/disease')
const FarmNote=require('../models/farm-note')
const Finance=require('../models/finance')
const Nutrition=require('../models/nutrition')
const Task=require('../models/tasks')
const Market=require('../models/market')
const Worker=require('../models/workers')
const Farm=require('../models/farm')
const Contact=require('../models/contact')
const Clutch=require('../models/clutch')
const Egg=require('../models/egg')




// --------------Google Drive--------------
// const {google} = require('googleapis');
// const fs = require('fs');




// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_DRIVE_CLIENT_ID,
//   process.env.GOOGLE_DRIVE_SECRET,
//   'https://api.modrnfarm.com'
// );

// oauth2Client.setCredentials({
//   refresh_token: 'YOUR_REFRESH_TOKEN'
// });

// const drive = google.drive({ version: 'v3', auth: oauth2Client });

// // Backup function
// const PostBackup = async (req, res) => {
//   const userId = req.body.userId;

//   try {
//     const user = await User.findById(userId);
//     const birds = await Bird.find({ user: userId });
//     const couples = await Couple.find({ user: userId });
//     const products = await Product.find({ user: userId });

//     const backupData = {
//       userData: user,
//       birdsData: birds,
//       couplesData: couples,
//       productsData: products
//     };

//     const backupFileName = `backup_${userId}_${Date.now()}.json`;
//     const backupFilePath = `./backups/${backupFileName}`;

//     fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));

//     const fileMetadata = {
//       name: backupFileName,
//       parents: ['YOUR_FOLDER_ID'] // Specify the folder ID where you want to store the backup file in Google Drive
//     };

//     const media = {
//       mimeType: 'application/json',
//       body: fs.createReadStream(backupFilePath)
//     };

//     const response = await drive.files.create({
//       resource: fileMetadata,
//       media: media,
//       fields: 'id'
//     });

//     fs.unlinkSync(backupFilePath);

//     res.status(200).send({ message: 'Backup successful', fileId: response.data.id });
//   } catch (error) {
//     res.status(500).send({ message: 'Error creating backup', error });
//   }
// };

// // Restore function
// const PostRestore = async (req, res) => {
//   const { userId, fileId } = req.body;

//   try {
//     const filePath = `./backups/restore_${userId}.json`;
//     const dest = fs.createWriteStream(filePath);

//     const response = await drive.files.get(
//       { fileId: fileId, alt: 'media' },
//       { responseType: 'stream' }
//     );

//     response.data
//       .on('end', async () => {
//         const backupData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

//         await User.findByIdAndUpdate(userId, backupData.userData, { new: true });

//         await Bird.deleteMany({ user: userId });
//         await Bird.insertMany(backupData.birdsData);

//         await Couple.deleteMany({ user: userId });
//         await Couple.insertMany(backupData.couplesData);

//         await Product.deleteMany({ user: userId });
//         await Product.insertMany(backupData.productsData);

//         fs.unlinkSync(filePath);

//         res.status(200).send({ message: 'Restore successful' });
//       })
//       .on('error', (error) => {
//         res.status(500).send({ message: 'Error downloading backup', error });
//       })
//       .pipe(dest);
//   } catch (error) {
//     res.status(500).send({ message: 'Error restoring data', error });
//   }
// };




// GET ALL BACKUP
const PostBackup = async (req, res, next) => {
    console.log("BACKUP!!");
    const userId = req.body.userId;

    try {
        const user = await User.findById(userId);
        const birds = await Bird.find({ user: userId });
        const couples = await Couple.find({ user: userId });
        const products = await Product.find({ user: userId });
        const treatments = await Treatment.find({ user: userId });
        const disease = await Disease.find({ user: userId });
        const farmNote = await FarmNote.find({ user: userId });
        const finance = await Finance.find({ user: userId });
        const nutrition = await Nutrition.find({ user: userId });

        const task = await Task.find({ user: userId });
        const market = await Market.find({ user: userId });
        const worker = await Worker.find({ user: userId });
        const farm = await Farm.find({ user: userId });
        const contact = await Contact.find({ user: userId });
        const clutch = await Clutch.find({ user: userId });
        const egg = await Egg.find({ user: userId });




        // Check if a backup already exists for the user
        const existingBackup = await Backup.findOne({ userId });

        if (existingBackup) {
            // Delete the existing backup
            await Backup.deleteOne({ userId });
        }

        // Create new backup
        const backupData = new Backup({
            userId: user._id,
            userData: user,
            birdsData: birds,
            couplesData: couples,
            productsData: products,
            treatmentsData: treatments,
            diseasesData:disease,
            farmNotesData:farmNote,
            financesData: finance,
            nutritionsData:nutrition,
            tasksData:task,
            marketsData: market,
            workersData:worker,
            farmsData: farm,
            contactsData:contact,
            clutchesData:clutch,
            eggsData:egg


        });

        await backupData.save();
        res.status(200).send({ message: 'Backup successful' });
    } catch (error) {
        res.status(500).send({ message: 'Error creating backup', error });
    }
};

// GET RESTORE
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

        await Treatment.deleteMany({user:  userId });
        await Treatment.insertMany(backupData.treatmentsData);
        await Disease.deleteMany({user:  userId });
        await Disease.insertMany(backupData.diseasesData);
        await FarmNote.deleteMany({user:  userId });
        await FarmNote.insertMany(backupData.farmNotesData);
        await Finance.deleteMany({user:  userId });
        await Finance.insertMany(backupData.financesData);
        await Nutrition.deleteMany({user:  userId });
        await Nutrition.insertMany(backupData.nutritionsData);
        await Task.deleteMany({user:  userId });
        await Task.insertMany(backupData.tasksData);

        await Market.deleteMany({user:  userId });
        await Market.insertMany(backupData.marketsData);

        await Worker.deleteMany({user:  userId });
        await Worker.insertMany(backupData.workersData);
        
        await Farm.deleteMany({user:  userId });
        await Farm.insertMany(backupData.farmsData);

        await Contact.deleteMany({user:  userId });
        await Contact.insertMany(backupData.contactsData);
        
        await Clutch.deleteMany({user:  userId });
        await Clutch.insertMany(backupData.clutchesData);
        
        await Egg.deleteMany({user:  userId });
        await Egg.insertMany(backupData.eggsData);

        

        res.status(200).send({ message: 'Restore successful' });
    } catch (error) {
        res.status(500).send({ message: 'Error restoring data', error });
    }
};



module.exports={
    PostBackup,
    PostRestore,
   


}