const express = require('express');
const router = express.Router();
const Clinic = require('../models/Clinic');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bcrypt = require('bcryptjs');

// Get all clinics (admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const clinics = await Clinic.find().sort({ name: 1 });
    res.json(clinics);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single clinic (admin or clinic user)
router.get('/:id', auth, async (req, res) => {
  try {
    // Check if user has access to this clinic
    if (req.user.role !== 'admin' && req.user.clinicId.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    
    res.json(clinic);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create clinic (admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const { name, address, contact, username, password } = req.body;
    
    // Create clinic
    const clinic = new Clinic({
      name,
      address,
      contact
    });
    
    await clinic.save();
    
    // Create user for this clinic
    if (username && password) {
      // Check if username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      const user = new User({
        username,
        password,
        role: 'clinic',
        clinicId: clinic._id
      });
      
      await user.save();
    }
    
    res.json(clinic);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update clinic (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { name, address, contact, active } = req.body;
    
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    
    clinic.name = name || clinic.name;
    clinic.address = address || clinic.address;
    
    if (contact) {
      clinic.contact = {
        ...clinic.contact,
        ...contact
      };
    }
    
    clinic.active = active !== undefined ? active : clinic.active;
    
    await clinic.save();
    res.json(clinic);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create/update user for clinic (admin only)
router.post('/:id/user', [auth, admin], async (req, res) => {
  try {
    const { username, password } = req.body;
    const clinicId = req.params.id;
    
    // Validate clinic
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    
    // Find existing user
    let user = await User.findOne({ clinicId, role: 'clinic' });
    
    if (user) {
      // Update existing user
      user.username = username || user.username;
      
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
    } else {
      // Create new user
      user = new User({
        username,
        password,
        role: 'clinic',
        clinicId
      });
    }
    
    await user.save();
    res.json({ username: user.username, clinicId: user.clinicId });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 