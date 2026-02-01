const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update onboarding data
router.put('/update-onboarding', authMiddleware, async (req, res) => {
  try {
    const { onboardingData } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update onboarding data
    user.onboardingData = {
      ...user.onboardingData,
      ...onboardingData
    };
    
    await user.save();
    
    console.log('✅ Onboarding data updated for:', user.email);
    
    res.json({ success: true, message: 'Onboarding data saved' });
  } catch (error) {
    console.error('❌ Update onboarding error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to save onboarding data',
      error: error.message 
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email, updatedAt: new Date() },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

module.exports = router;
