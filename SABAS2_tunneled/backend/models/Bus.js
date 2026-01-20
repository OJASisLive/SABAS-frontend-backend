const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  routeFrom: { type: String, required: true },
  assignedDriver: { type: String, required: true },
});

module.exports = mongoose.model('Bus', busSchema);
