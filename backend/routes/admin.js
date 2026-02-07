const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// If you have an 'auth' middleware to check for logged-in users, import it here.
// For now, I will use a simple pass-through if you don't have strict admin checks yet.
// If you DO have auth, uncomment the line below:
// const auth = require('../middleware/auth'); 

// ROUTE: POST /api/admin/ai-insights
// This matches what we called in the frontend
router.post('/ai-insights', adminController.getAIInsights);

module.exports = router;