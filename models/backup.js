const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const backupSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  backupUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Backup', backupSchema);
