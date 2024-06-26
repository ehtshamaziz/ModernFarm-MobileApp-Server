const mongoose = require("mongoose");

const farmNoteSchema = new mongoose.Schema({
 
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
  worker:{ type: mongoose.Schema.Types.ObjectId, ref: "Worker", },
  selfAssignedTo:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  notesAssignedTo:{ type: String},
  description: { type: String, required: true },
  taskDate: { type: Date },
  action: {type:Boolean, default:false},
  taskDone:{ type: Date },
  
});

const FarmNote = mongoose.model("FarmNote", farmNoteSchema);

module.exports = FarmNote;
