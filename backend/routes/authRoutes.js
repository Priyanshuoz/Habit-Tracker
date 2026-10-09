const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  handleVaultPin,
  getVaultPhotos,
  addVaultPhoto,
  deleteVaultPhoto,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public Auth
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Private Vault
router.post('/vault/pin', protect, handleVaultPin);
router.get('/vault/photos', protect, getVaultPhotos);
router.post('/vault/photos', protect, addVaultPhoto);
router.delete('/vault/photos/:id', protect, deleteVaultPhoto);

module.exports = router;
