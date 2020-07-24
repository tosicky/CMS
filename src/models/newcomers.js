const mongoose = require("mongoose");

const newcomerSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  mobile: { type: String, required: false, unique: true, trim: true },
  residence: { type: String, required: false },
  gender: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  visitDate: { type: Date, required: true },
  createdDate: { type: Date, default: Date.now },
});

newcomerSchema.pre("save", async function () {
  const visitor = this;
  let vd = new Date(visitor.visitDate);
  let currentDate = new Date();

  if (vd.getFullYear() > currentDate.getFullYear()) {
    throw new Error("Visitor visit date should be within the current year.");
  }
});

// Getter
newcomerSchema.path("visitDate").get(function (num) {
  if (!num) {
    return "UNKNOWN";
  }
  let date = new Date(num);
  return date.toUTCString();
});

const Newcomer = mongoose.model("Newcomer", newcomerSchema);

module.exports = Newcomer;
