const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const aiRecommendation = require('../services/aiRecommendation');

// Generate AI-powered recommendations
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Prepare user profile
    const userProfile = {
      skills: [
        ...(user.resume?.parsedData?.skills || []),
        ...(user.onboardingData?.skills || [])
      ],
      interests: user.onboardingData?.interests || [],
      careerGoals: user.onboardingData?.careerGoals || '',
      fieldOfStudy: user.onboardingData?.fieldOfStudy || '',
      experience: user.onboardingData?.experience || 'Fresher'
    };
    
    console.log('🤖 Generating AI recommendations for:', user.email);
    console.log('   Skills:', userProfile.skills.slice(0, 5));
    console.log('   Interests:', userProfile.interests.slice(0, 3));
    
    // Get AI-powered recommendations
    const recommendations = aiRecommendation.getRecommendations(userProfile, 3);
    
    // Save primary recommendation
    if (recommendations && recommendations.length > 0) {
      user.recommendedCareer = {
        ...recommendations[0],
        generatedAt: new Date()
      };
      user.onboardingData.completedOnboarding = true;
      await user.save();
      
      console.log('✅ Recommendation saved:', recommendations[0].title);
      console.log('   Match Score:', recommendations[0].matchScore + '%');
    }
    
    res.json({
      success: true,
      recommendation: recommendations[0],
      alternatives: recommendations.slice(1)
    });
    
  } catch (error) {
    console.error('❌ Recommendation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating recommendation', 
      error: error.message 
    });
  }
});

module.exports = router;
