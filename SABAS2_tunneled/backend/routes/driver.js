const express = require("express");
const router = express.Router();
const Driver = require("../models/Driver");

// Get all drivers
router.get("/", async (req, res) => {
  const drivers = await Driver.find();
  res.json({ data: drivers });
});

// Get driver stats
router.get("/stats", async (req, res) => {
  try {
    const total = await Driver.countDocuments();
    const verified = await Driver.countDocuments({ verified: true });
    const notVerified = total - verified;
    const assigned = await Driver.countDocuments({ assignedBus: { $ne: null, $nin: [''], $exists: true } });
    const unassigned = total - assigned;
    res.json({ total, verified, notVerified, assigned, unassigned });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch driver stats' });
  }
});

// Add driver
router.post("/", async (req, res) => {
  const driver = new Driver(req.body);
  await driver.save();
  res.json(driver);
});

// Update driver
router.put("/:id", async (req, res) => {
  const updated = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete driver
router.delete("/:id", async (req, res) => {
  await Driver.findByIdAndDelete(req.params.id);
  res.json({ message: "Driver deleted" });
});

module.exports = router;
