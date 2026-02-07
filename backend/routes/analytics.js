const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Helper to check admin role (Mock for now, enforce real role check in prod)
const checkAdmin = (req, res, next) => {
  // if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  next();
};

// GET: All Analytics Data
router.get('/dashboard-stats', authMiddleware, checkAdmin, async (req, res) => {
  try {
    // 1. Career Trends (Group users by recommended career)
    const careerTrends = await User.aggregate([
        { $match: { "recommendedCareer.title": { $exists: true, $ne: null } } },
        { $group: { _id: "$recommendedCareer.title", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 } // Top 5 careers
    ]);

    // 2. Skill Popularity (Course Popularity Proxy)
    // Unwind the currentSkills array and count occurrences
    const skillPopularity = await User.aggregate([
        { $unwind: "$recommendedCareer.currentSkills" },
        { $group: { _id: "$recommendedCareer.currentSkills", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    // 3. Success Rate Tracking
    // Compare users who have verified skills vs total users
    const totalUsers = await User.countDocuments();
    const activeLearners = await User.countDocuments({ "recommendedCareer.currentSkills.0": { $exists: true } });
    
    // 4. Monthly Signups (Success Rate / Growth)
    const monthlyGrowth = await User.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    res.json({
        success: true,
        data: {
            careerTrends: careerTrends.map(c => ({ name: c._id, value: c.count })),
            skillPopularity: skillPopularity.map(s => ({ name: s._id, students: s.count })),
            overview: {
                totalStudents: totalUsers,
                activeLearners: activeLearners,
                completionRate: Math.round((activeLearners / (totalUsers || 1)) * 100)
            },
            growth: monthlyGrowth.map(g => ({ name: `Month ${g._id}`, users: g.count }))
        }
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ success: false, message: "Server error generating reports" });
  }
});

module.exports = router;