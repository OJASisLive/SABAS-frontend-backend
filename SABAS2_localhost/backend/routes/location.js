const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// POST /api/location/update-location
router.post('/update-location', async (req, res) => {
  try {
    const { bus_id, latitude, longitude } = req.body;
    if (!bus_id) return res.status(400).json({ status: 'failure', error: 'Missing bus_id' });

    let location = await Location.findOne({ bus_id });

    if (location) {
      location.latitude = latitude;
      location.longitude = longitude;
      location.last_updated = new Date();
    } else {
      location = new Location({ bus_id, latitude, longitude });
    }

    await location.save();

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    io.emit('locationUpdated', { busId: bus_id, latitude, longitude });

    res.json({ status: 'success', bus_id, latitude, longitude });
  } catch (err) {
    console.error('❌ Error updating location:', err);
    res.status(500).json({ status: 'failure', error: err.message });
  }
});

// GET /api/location/get-location?bus_id=...
router.get('/get-location', async (req, res) => {
  const bus_id = req.query.bus_id;
  if (!bus_id) return res.status(400).json({ status: 'failure', error: 'Missing bus_id' });

  try {
    const location = await Location.findOne({ bus_id });
    if (!location) return res.status(404).json({ status: 'failure', error: 'Invalid Bus ID' });

    res.json({ status: 'success', location });
  } catch (err) {
    console.error('❌ Error fetching location:', err);
    res.status(500).json({ status: 'failure', error: err.message });
  }
});

// Optional: get all locations
router.get('/all', async (req, res) => {
  try {
    const allLocations = await Location.find();
    res.json(allLocations);
  } catch (err) {
    res.status(500).json({ status: 'failure', error: err.message });
  }
});

module.exports = router;
