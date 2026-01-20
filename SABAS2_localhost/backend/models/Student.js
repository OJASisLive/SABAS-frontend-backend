const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  assignedBus: { type: String },          // Store bus number or ID
  assignedDriver: { type: String },       // Store driver name or ID
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
