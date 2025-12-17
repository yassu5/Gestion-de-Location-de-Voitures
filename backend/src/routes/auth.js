const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const {
  login,
  getProfile,
  getAllUtilisateurs,
  createUtilisateur,
  deleteUtilisateur,
} = require('../controllers/authController');

router.post('/login', login);
router.get('/profile', auth, getProfile);
router.get('/utilisateurs', auth, adminOnly, getAllUtilisateurs);
router.post('/utilisateurs', auth, adminOnly, createUtilisateur);
router.delete('/utilisateurs/:id', auth, adminOnly, deleteUtilisateur);

module.exports = router;
