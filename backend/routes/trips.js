const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/trips
// @desc    Save a generated itinerary
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { destination, budget, duration, travellers, itineraryData } = req.body;

    const newTrip = new Trip({
      user: req.user.id,
      destination,
      budget,
      duration,
      travellers,
      itineraryData,
    });

    const savedTrip = await newTrip.save();
    res.status(201).json({ success: true, trip: savedTrip });
  } catch (error) {
    console.error('Error saving trip:', error);
    res.status(500).json({ success: false, message: 'Server error saving trip' });
  }
});

// @route   GET /api/trips
// @desc    Get all trips for the logged in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, trips });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ success: false, message: 'Server error fetching trips' });
  }
});

module.exports = router;
