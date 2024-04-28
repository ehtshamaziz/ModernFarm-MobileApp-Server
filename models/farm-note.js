const mongoose = require("mongoose");

const farmNoteSchema = new mongoose.Schema({
 
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
  worker:{ type: mongoose.Schema.Types.ObjectId, ref: "Worker", },
  selfAssignedTo:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  taskDate: { type: Date },
  action: {type:Boolean, default:false},
  
});

const FarmNote = mongoose.model("FarmNote", farmNoteSchema);

module.exports = FarmNote;
