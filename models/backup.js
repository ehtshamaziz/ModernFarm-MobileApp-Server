const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userData: { type: Object, required: true },
    birdsData: { type: Array, required: true },
    couplesData: { type: Array, required: true },
    productsData: { type: Array, required: true },
    treatmentsData: { type: Array, required: true },
    diseasesData: { type: Array, required: true },
    farmNotesData: { type: Array, required: true },
    nutritionsData: { type: Array, required: true },
    tasksData: { type: Array, required: true },
    marketsData: { type: Array, required: true },
    workersData: { type: Array, required: true },
    farmsData: { type: Array, required: true },
    contactsData: { type: Array, required: true },
    clutchesData: { type: Array, required: true },
    eggsData: { type: Array, required: true },


  
    

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Backup', backupSchema);
