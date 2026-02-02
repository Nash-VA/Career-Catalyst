const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/onboarding/complete
// @desc    Save onboarding data and generate recommendation
// @access  Private
router.post('/complete', protect, async (req, res) => {
  try {
    const {
      skills,
      interests,
      experience,
      careerGoals,
      fieldOfStudy,
      location,
      currentRole,
      educationLevel,
      preferredIndustry
    } = req.body;

    console.log('📝 Saving onboarding data for user:', req.user.email);
    console.log('   Skills:', skills);
    console.log('   Interests:', interests);
    console.log('   Experience:', experience);

    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user data
    user.skills = skills || [];
    user.interests = interests || [];
    user.experience = experience || '';
    user.careerGoals = careerGoals || [];
    user.fieldOfStudy = fieldOfStudy || '';
    user.location = location || '';
    user.profile = {
      ...user.profile,
      currentRole: currentRole || '',
      educationLevel: educationLevel || '',
      preferredIndustry: preferredIndustry || ''
    };
    user.onboardingCompleted = true;

    // ✅ Generate AI recommendation (call ML service)
    try {
      console.log('🤖 Calling ML service for recommendation...');
      
      const mlResponse = await fetch('http://localhost:5001/api/recommend-career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: skills || [],
          interests: interests || [],
          experience: experience || '',
          career_goals: careerGoals || [],
          field_of_study: fieldOfStudy || ''
        }),
        timeout: 30000
      });

      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        
        if (mlData.success && mlData.recommendation) {
          user.recommendedCareer = mlData.recommendation;
          console.log('✅ AI Recommendation received:', mlData.recommendation.title);
        } else {
          console.warn('⚠️ ML service returned no recommendation, using fallback');
          user.recommendedCareer = generateFallbackRecommendation(skills, interests, experience);
        }
      } else {
        console.warn('⚠️ ML service HTTP error, using fallback');
        user.recommendedCareer = generateFallbackRecommendation(skills, interests, experience);
      }
    } catch (mlError) {
      console.error('❌ ML service error:', mlError.message);
      console.log('Using fallback recommendation...');
      user.recommendedCareer = generateFallbackRecommendation(skills, interests, experience);
    }

    // Save to database
    await user.save();

    console.log('✅ Onboarding completed and saved for:', user.email);
    console.log('   Recommended Career:', user.recommendedCareer?.title);

    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        skills: user.skills,
        interests: user.interests,
        experience: user.experience,
        recommendedCareer: user.recommendedCareer,
        onboardingCompleted: user.onboardingCompleted
      }
    });

  } catch (error) {
    console.error('❌ Onboarding error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete onboarding',
      error: error.message
    });
  }
});

// Fallback recommendation logic
function generateFallbackRecommendation(skills, interests, experience) {
  const skillsLower = (skills || []).map(s => s.toLowerCase());
  const interestsLower = (interests || []).map(i => i.toLowerCase());

  console.log('🔄 Generating fallback recommendation based on:', { skills: skillsLower, interests: interestsLower });

  // Marketing/Digital Marketing
  if (skillsLower.some(s => s.includes('market') || s.includes('seo') || s.includes('social media') || s.includes('advertising')) ||
      interestsLower.some(i => i.includes('market') || i.includes('advertising') || i.includes('content'))) {
    return {
      title: 'Digital Marketing Specialist',
      description: 'Plan and execute digital marketing campaigns across various channels to reach target audiences and drive business growth',
      averageSalary: '₹4,00,000 - ₹8,00,000',
      requiredSkills: ['SEO', 'Social Media Marketing', 'Content Marketing', 'Google Analytics', 'Email Marketing'],
      skillGap: ['Advanced SEO', 'PPC Advertising', 'Marketing Automation', 'Data Analytics'],
      growthRate: '15%',
      demandLevel: 'High'
    };
  } 
  // Web Development
  else if (skillsLower.some(s => s.includes('react') || s.includes('javascript') || s.includes('node') || s.includes('html') || s.includes('css')) ||
           interestsLower.some(i => i.includes('web') || i.includes('coding') || i.includes('programming'))) {
    return {
      title: 'Full Stack Developer',
      description: 'Build complete web applications from frontend to backend, handling databases, servers, and client-side development',
      averageSalary: '₹6,00,000 - ₹15,00,000',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'HTML/CSS', 'REST APIs'],
      skillGap: ['TypeScript', 'Docker', 'AWS', 'System Design'],
      growthRate: '22%',
      demandLevel: 'Very High'
    };
  } 
  // Data Science/Analysis
  else if (skillsLower.some(s => s.includes('data') || s.includes('python') || s.includes('sql') || s.includes('analytics')) ||
           interestsLower.some(i => i.includes('data') || i.includes('analytics') || i.includes('statistics'))) {
    return {
      title: 'Data Analyst',
      description: 'Analyze data to help businesses make informed decisions, create reports, and identify trends',
      averageSalary: '₹5,00,000 - ₹10,00,000',
      requiredSkills: ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics', 'Data Visualization'],
      skillGap: ['Machine Learning', 'R Programming', 'Big Data', 'Advanced Statistics'],
      growthRate: '20%',
      demandLevel: 'High'
    };
  }
  // Design
  else if (skillsLower.some(s => s.includes('design') || s.includes('ui') || s.includes('ux') || s.includes('figma')) ||
           interestsLower.some(i => i.includes('design') || i.includes('creative') || i.includes('ui'))) {
    return {
      title: 'UI/UX Designer',
      description: 'Design user interfaces and experiences that are intuitive, engaging, and visually appealing',
      averageSalary: '₹4,50,000 - ₹12,00,000',
      requiredSkills: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping'],
      skillGap: ['User Testing', 'Design Systems', 'Animation', 'Accessibility'],
      growthRate: '18%',
      demandLevel: 'High'
    };
  }
  // Default fallback
  else {
    console.log('⚠️ No specific match found, using default recommendation');
    return {
      title: 'Full Stack Developer',
      description: 'Build complete web applications from frontend to backend, handling databases, servers, and client-side development',
      averageSalary: '₹6,00,000 - ₹15,00,000',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'HTML/CSS', 'REST APIs'],
      skillGap: ['TypeScript', 'Docker', 'AWS', 'System Design'],
      growthRate: '22%',
      demandLevel: 'Very High'
    };
  }
}

module.exports = router;
