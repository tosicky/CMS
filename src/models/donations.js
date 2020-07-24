const mongoose = require("mongoose");
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const donationSchema = new mongoose.Schema({
  donatedBy: { type: mongoose.Schema.Types.ObjectId, refPath: "refModel" },
  refModel: { type: String, required: true, enum: ["Member", "Newcomer"] },
  amount: { type: Currency, required: true, trim: true },
  donationDate: { type: Date, required: true },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

// Getter
donationSchema.path("amount").get(function (num) {
  return (num / 100).toFixed(2);
});

// Setter
donationSchema.path("amount").set(function (num) {
  return num * 100;
});

// Getter
donationSchema.path("donationDate").get(function (num) {
  if (!num) {
    return "UNKNOWN";
  }
  let date = new Date(num);
  return date.toDateString();
});

donationSchema.pre("save", async function () {
  const donation = this;
  let dd = new Date(donation.donationDate);
  let currentDate = new Date();

  if (dd.getFullYear() > currentDate.getFullYear()) {
    throw new Error("Donation date must be within the current calendar year.");
  }

  if (donation.isModified("amount")) {
    donation.updatedDate = Date.now;
  }
});

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
