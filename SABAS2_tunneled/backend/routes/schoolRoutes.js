const express = require("express");
const School = require("../models/School");

const router = express.Router();

// ✅ Create a School
router.post("/", async (req, res) => {
  try {
    const { code, name, address, latitude, longitude } = req.body;

    if (!code || !name || !address || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Ensure code is unique
    const existing = await School.findOne({ code });
    if (existing) {
      return res.status(409).json({ error: "A school with this code already exists." });
    }

    const school = new School({ code, name, address, latitude, longitude });
    await school.save();
    res.status(201).json(school);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all schools
router.get("/", async (req, res) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 });
    res.json(schools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get single school by code
router.get("/:code", async (req, res) => {
  try {
    const school = await School.findOne({ code: req.params.code });
    if (!school) return res.status(404).json({ error: "School not found. (Get Single)" });
    res.json(school);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update school by code
router.put("/:code", async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    const updated = await School.findOneAndUpdate(
      { code: req.params.code },
      { name, address, latitude, longitude },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "School not found. (Update)" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete school by code
router.delete("/:code", async (req, res) => {
  try {
    const deleted = await School.findOneAndDelete({ code: req.params.code });
    if (!deleted) return res.status(404).json({ error: "School not found. (Delete)" });
    res.json({ message: "School deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
