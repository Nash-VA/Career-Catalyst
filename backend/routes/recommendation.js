const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const mlService = require('../services/mlService');

// Generate recommendations
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prepare user data
    const userData = {
      skills: [
        ...(user.resume?.parsedData?.skills || []),
        ...(user.onboardingData?.skills || [])
      ],
      interests: user.onboardingData?.interests || [],
      careerGoals: user.onboardingData?.careerGoals || '',
      fieldOfStudy: user.onboardingData?.fieldOfStudy || '',
      experience: user.onboardingData?.experience || 'Fresher'
    };
    
    console.log('Generating recommendation for user:', user.email);
    console.log('User data:', userData);
    
    // Get recommendations from ML service
    const recommendations = await mlService.generateRecommendations(userData);
    
    // Save primary recommendation
    if (recommendations && recommendations.length > 0) {
      user.recommendedCareer = {
        ...recommendations[0],
        generatedAt: new Date()
      };
      user.updatedAt = new Date();
      await user.save();
    }
    
    res.json({
      success: true,
      recommendation: recommendations[0],
      alternatives: recommendations.slice(1)
    });
  } catch (error) {
    console.error('Recommendation generation error:', error);
    res.status(500).json({ 
      message: 'Error generating recommendation', 
      error: error.message 
    });
  }
});

// Get user's recommendation
router.get('/my-recommendation', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || !user.recommendedCareer) {
      return res.status(404).json({ message: 'No recommendation found' });
    }
    
    res.json({ success: true, recommendation: user.recommendedCareer });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendation', error: error.message });
  }
});

module.exports = router;
