const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const {
  getAllVehicules,
  getVehiculeById,
  createVehicule,
  updateVehicule,
  deleteVehicule,
} = require('../controllers/vehiculeController');

router.get('/', auth, getAllVehicules);
router.get('/:id', auth, getVehiculeById);
router.post('/', auth, adminOnly, createVehicule);
router.put('/:id', auth, adminOnly, updateVehicule);
router.delete('/:id', auth, adminOnly, deleteVehicule);

module.exports = router;
