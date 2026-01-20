const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNo: { type: String, required: true },
  mobileNo: { type: String, required: true, unique: true },
  assignedBus: { type: String, required: true },
  verified: { type: Boolean, default: false },
  email: { type: String },
  collegeCode: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Driver", driverSchema);
