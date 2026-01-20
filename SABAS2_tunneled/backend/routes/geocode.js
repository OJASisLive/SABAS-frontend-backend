const express = require('express');
const axios = require('axios');
const router = express.Router();

// 🔹 Proxy for Nominatim SEARCH
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { format: 'json', q },
      headers: {
        'User-Agent': 'YourAppName/1.0 (your-email@example.com)',
        'Referer': 'https://teamsabas.baazsmp.fun'
      },
      timeout: 5000
    });

    res.json(response.data);
  } catch (err) {
    console.error('Geocode Search Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Proxy for Nominatim REVERSE
router.get('/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: "lat & lon are required" });

    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: { format: 'json', lat, lon },
      headers: {
        'User-Agent': 'YourAppName/1.0 (your-email@example.com)',
        'Referer': 'https://teamsabas.baazsmp.fun'
      },
      timeout: 5000
    });

    res.json(response.data);
  } catch (err) {
    console.error('Geocode Reverse Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
