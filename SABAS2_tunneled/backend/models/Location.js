const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  bus_id: {
    type: String,
    required: true,
    unique: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Location', locationSchema);
