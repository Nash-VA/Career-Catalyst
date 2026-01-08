const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// Upload and parse resume
router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Parse PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;
    
    // Extract skills
    const skills = extractSkills(resumeText);
    const experience = extractExperience(resumeText);
    const education = extractEducation(resumeText);
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        resume: {
          filename: req.file.originalname,
          uploadDate: new Date(),
          parsedData: {
            skills,
            education,
            experience,
            summary: resumeText.substring(0, 500)
          }
        }
      },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      parsedData: { skills, education, experience }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error parsing resume', error: error.message });
  }
});

// Helper functions
function extractSkills(text) {
  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue',
    'HTML', 'CSS', 'MongoDB', 'SQL', 'PostgreSQL', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'GCP', 'Machine Learning', 'Data Science', 'TensorFlow',
    'Git', 'Agile', 'REST API', 'GraphQL', 'TypeScript', 'C++', 'C#',
    'Ruby', 'PHP', 'Swift', 'Kotlin', 'Flutter', 'React Native', 'Express',
    'Django', 'Flask', 'Spring', 'Jenkins', 'Terraform', 'Pandas', 'NumPy'
  ];
  
  const foundSkills = [];
  const lowerText = text.toLowerCase();
  
  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills;
}

function extractExperience(text) {
  const expPattern = /(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/gi;
  const match = text.match(expPattern);
  return match ? match[0] : 'Not specified';
}

function extractEducation(text) {
  const eduKeywords = ['bachelor', 'master', 'phd', 'degree', 'diploma', 'b.tech', 'b.e', 'm.tech', 'm.e', 'mba'];
  const lines = text.split('\n');
  
  for (let line of lines) {
    if (eduKeywords.some(k => line.toLowerCase().includes(k))) {
      return line.trim();
    }
  }
  
  return 'Not specified';
}

module.exports = router;
