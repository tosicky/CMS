const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupname: { type: String, required: true, trim: true },
  description: { type: String, required: false, trim: true },
  createdDate: { type: Date, default: Date.now },
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
