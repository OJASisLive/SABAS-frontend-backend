const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ data: students });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const assigned = await Student.countDocuments({ assignedBus: { $ne: null, $nin: [''], $exists: true } });
    const unassigned = total - assigned;
    res.json({ total, assigned, unassigned });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student stats' });
  }
});

// Add new student
router.post('/', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json({ message: 'Student added', data: newStudent });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add student' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student updated', data: updatedStudent });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;
