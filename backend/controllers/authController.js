const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (id, name, email) => {
  return jwt.sign(
    { id, name, email },
    process.env.JWT_SECRET || 'supersecretjwtkey_habit_tracker_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      avatar: avatar || '',
    });

    if (user) {
      return res.status(201).json({
        token: generateToken(user._id, user.name, user.email),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '',
          hasVaultPin: false,
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('[Register Error]:', error.message);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        token: generateToken(user._id, user.name, user.email),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '',
          hasVaultPin: Boolean(user.vaultPin),
        },
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('[Login Error]:', error.message);
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -vaultPin');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      hasVaultPin: Boolean(user.vaultPin),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user profile' });
  }
};

// @desc    Update user profile (name, avatar)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
      hasVaultPin: Boolean(user.vaultPin),
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error.message);
    res.status(500).json({ message: error.message || 'Error updating profile' });
  }
};

// @desc    Verify or set Vault PIN
// @route   POST /api/auth/vault/pin
// @access  Private
const handleVaultPin = async (req, res) => {
  try {
    const { pin, action, newPin } = req.body; // action: 'unlock' | 'set' | 'change'
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate PIN is strictly 4 numeric digits
    if (!pin || !/^\d{4}$/.test(pin.toString())) {
      return res.status(400).json({ message: 'PIN must be exactly 4 digits (0-9)' });
    }

    // Setting PIN for the first time
    if (!user.vaultPin) {
      const salt = await bcrypt.genSalt(10);
      user.vaultPin = await bcrypt.hash(pin.toString(), salt);
      await user.save();
      return res.json({ success: true, message: 'Vault PIN created successfully', unlocked: true });
    }

    // Changing existing PIN
    if (action === 'change') {
      const isMatch = await bcrypt.compare(pin.toString(), user.vaultPin);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect current PIN' });
      }
      if (!newPin || !/^\d{4}$/.test(newPin.toString())) {
        return res.status(400).json({ message: 'New PIN must be exactly 4 digits (0-9)' });
      }
      const salt = await bcrypt.genSalt(10);
      user.vaultPin = await bcrypt.hash(newPin.toString(), salt);
      await user.save();
      return res.json({ success: true, message: 'PIN changed successfully', unlocked: true });
    }

    // Verifying/Unlocking Vault PIN
    const isMatch = await bcrypt.compare(pin.toString(), user.vaultPin);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect Vault PIN' });
    }

    return res.json({ success: true, message: 'Vault unlocked successfully', unlocked: true });
  } catch (error) {
    console.error('[Vault PIN Error]:', error.message);
    res.status(500).json({ message: 'Error handling vault security PIN' });
  }
};

// @desc    Get all vault photos
// @route   GET /api/auth/vault/photos
// @access  Private
const getVaultPhotos = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.vaultPhotos || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vault photos' });
  }
};

// @desc    Add a photo to the vault
// @route   POST /api/auth/vault/photos
// @access  Private
const addVaultPhoto = async (req, res) => {
  try {
    const { imageUrl, category, date, note, weight } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image data is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newPhoto = {
      id: 'vp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      imageUrl,
      category: category || 'Physique',
      date: date || new Date().toISOString().split('T')[0],
      note: note || '',
      weight: weight || '',
      createdAt: new Date(),
    };

    user.vaultPhotos.unshift(newPhoto);
    await user.save();

    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('[Add Vault Photo Error]:', error.message);
    res.status(500).json({ message: 'Error saving photo to vault' });
  }
};

// @desc    Delete a photo from the vault
// @route   DELETE /api/auth/vault/photos/:id
// @access  Private
const deleteVaultPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.vaultPhotos = user.vaultPhotos.filter((p) => p.id !== id && p._id?.toString() !== id);
    await user.save();

    res.json({ success: true, message: 'Photo deleted from vault' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting photo from vault' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  handleVaultPin,
  getVaultPhotos,
  addVaultPhoto,
  deleteVaultPhoto,
};
