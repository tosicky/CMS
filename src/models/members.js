const mongoose = require("mongoose");
const validator = require("validator");

const memberSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!value) {
        throw new Error("Field cannot be blank");
      }
    },
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!value) {
        throw new Error("Field cannot be blank");
      }
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  mobileNo: { type: String, required: false, unique: true, trim: true },
  gender: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  birthDate: { type: Date, required: false },
  isWorker: { type: Boolean, default: false },
  naturalGroup: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  createdDate: { type: Date, default: Date.now },
});

memberSchema.pre("save", async function () {
  const member = this;
  let dob = new Date(member.birthDate);
  let currentDate = new Date();

  if (dob.getFullYear() > currentDate.getFullYear()) {
    throw new Error("Date of Birth cannot be a future date.");
  }
});

// Getter
memberSchema.path("birthDate").get(function (num) {
  if (!num) {
    return "UNKNOWN";
  }
  let date = new Date(num);
  return date.toDateString();
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
