const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { generateSkillQuiz } = require('../services/quizGenerator');

// ==========================================
// 1. QUIZ & SKILL VERIFICATION ROUTES (NEW)
// ==========================================

// Generate AI Quiz for a specific skill
router.post('/generate-quiz', authMiddleware, async (req, res) => {
  try {
    const { skill } = req.body;
    
    // Call the Ollama service
    const quizData = await generateSkillQuiz(skill); 
    
    res.status(200).json({ success: true, quiz: quizData });
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    res.status(500).json({ success: false, message: "Could not generate quiz." });
  }
});

// Verify Quiz Score & Update Skill Progress
router.post('/verify-skill', authMiddleware, async (req, res) => {
  try {
    const { skill, score } = req.body;
    
    // 1. Validation: Check score
    if (score < 5) { 
      return res.status(400).json({ success: false, message: "Score too low to pass." });
    }

    // 2. Find the user
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // 3. Check if recommendedCareer exists
    if (!user.recommendedCareer) {
        return res.status(400).json({ success: false, message: "No career recommendation found." });
    }

    console.log(`Processing skill verification for: ${skill}`);

    // 4. Update Arrays (Using JS Logic for safety)
    
    // REMOVE from Skill Gap
    // We filter the array to exclude the verified skill
    const initialGapLength = user.recommendedCareer.skillGap.length;
    user.recommendedCareer.skillGap = user.recommendedCareer.skillGap.filter(s => s !== skill);

    // ADD to Current Skills (if not already there)
    if (!user.recommendedCareer.currentSkills.includes(skill)) {
        user.recommendedCareer.currentSkills.push(skill);
    }

    // 5. Mark Document as Modified and SAVE
    // This is crucial for nested objects in Mongoose
    user.markModified('recommendedCareer'); 
    await user.save();

    console.log("Skill verified and saved to database.");

    res.status(200).json({ 
        success: true, 
        message: `Skill '${skill}' Verified & Added!`,
        updatedGap: user.recommendedCareer.skillGap,
        updatedSkills: user.recommendedCareer.currentSkills
    });

  } catch (error) {
    console.error("Verify Skill Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. USER PROFILE ROUTES
// ==========================================

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

// Update user profile (Name/Email)
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

// Update onboarding data (Update entire object safely)
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
    
    // If onboarding is marked complete, ensure status reflects that
    if (onboardingData.completedOnboarding) {
        user.onboardingCompleted = true;
    }
    
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

// ==========================================
// 3. ADMIN ROUTES
// ==========================================

// Get all users (For Admin Panel)
router.get('/all-users', authMiddleware, async (req, res) => {
  try {
    // Note: In a real app, verify req.user.role === 'admin' here
    
    const users = await User.find()
      .select('-password') // Exclude passwords
      .sort({ createdAt: -1 }); // Newest users first

    // We return the RAW user objects here so the Frontend Modal 
    // can display detailed info (Career title, skills, gap, etc.)
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ ROBUST SKILL COMPLETION ROUTE
router.post('/update-career-progress', authMiddleware, async (req, res) => {
  try {
    const { skill } = req.body;
    const userId = req.userId;

    if (!skill) {
      return res.status(400).json({ success: false, message: "Skill is required" });
    }

    // Use findByIdAndUpdate for atomic operations (Guarantees save)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        // 1. Add to currentSkills (if it's not already there)
        $addToSet: { "recommendedCareer.currentSkills": skill },
        // 2. Remove from skillGap (if it exists there)
        $pull: { "recommendedCareer.skillGap": skill }
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ 
      success: true, 
      message: "Skill updated successfully", 
      currentSkills: updatedUser.recommendedCareer.currentSkills 
    });

  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;