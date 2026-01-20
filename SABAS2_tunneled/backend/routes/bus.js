const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');

// Get all buses
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json({ data: buses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
});

// Add a new bus
router.post('/', async (req, res) => {
  try {
    const { busNumber, capacity, routeFrom, assignedDriver } = req.body;

    if (!busNumber || !capacity || !routeFrom || !assignedDriver) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (isNaN(capacity)) {
      return res.status(400).json({ error: 'Capacity must be a number' });
    }

    const bus = new Bus({
      busNumber,
      capacity: Number(capacity),
      routeFrom,
      assignedDriver,
    });

    await bus.save();
    res.status(201).json({ message: 'Bus added', bus });
  } catch (err) {
    console.error('Error adding bus:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a bus by ID
router.put('/:id', async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json({ message: 'Bus updated', bus });
  } catch (err) {
    console.error('Error updating bus:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a bus by ID
router.delete('/:id', async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json({ message: 'Bus deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete bus' });
  }
});

module.exports = router;
