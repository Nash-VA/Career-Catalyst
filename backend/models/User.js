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
      skills: { type: [String], default: [] },
      education: String,
      experience: String,
      summary: String
    }
  },
  
  // Onboarding Data
  onboardingData: {
    completedOnboarding: { type: Boolean, default: false },
    fieldOfStudy: { type: String, default: '' },
    experience: { type: String, default: '' },
    interests: { type: [String], default: [] },
    careerGoals: { type: String, default: '' },
    skills: { type: [String], default: [] },
    preferredIndustries: { type: [String], default: [] }
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

// ✅ Update timestamp on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', UserSchema);
