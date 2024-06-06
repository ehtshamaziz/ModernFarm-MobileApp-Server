const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userData: { type: Object, required: true },
    birdsData: { type: Array, required: true },
    couplesData: { type: Array, required: true },
    productsData: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Backup', backupSchema);
