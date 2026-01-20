const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  email: { type: String },
  mobile: { type: String },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
});

// Automatically delete expired OTPs
OtpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', OtpSchema);
