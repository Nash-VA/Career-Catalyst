const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Resume Data
  resume: {
    filename: String,
    uploadDate: Date,
    parsedData: {
      skills: [String],
      education: String,
      experience: String,
      summary: String
    }
  },
  
  // Onboarding Data
  onboardingData: {
    completedOnboarding: { type: Boolean, default: false },
    fieldOfStudy: String,
    experience: String,
    interests: [String],
    careerGoals: String,
    skills: [String],
    preferredIndustries: [String]
  },
  
  // Career Recommendation
  recommendedCareer: {
    title: String,
    description: String,
    matchScore: Number,
    reason: String,
    requiredSkills: [String],
    currentSkills: [String],
    skillGap: [String],
    icon: String,
    generatedAt: Date
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
