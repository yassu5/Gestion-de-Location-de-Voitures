const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getAllLocations,
  getLocationById,
  getDashboardStats,
  createLocation,
  terminerLocation,
  annulerLocation,
} = require('../controllers/locationController');

router.get('/', auth, getAllLocations);
router.get('/stats/dashboard', auth, getDashboardStats);
router.get('/:id', auth, getLocationById);
router.post('/', auth, createLocation);
router.put('/:id/terminer', auth, terminerLocation);
router.put('/:id/annuler', auth, annulerLocation);

module.exports = router;
