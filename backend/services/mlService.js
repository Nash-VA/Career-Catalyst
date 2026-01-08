const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

class MLService {
  async generateRecommendations(userData) {
    try {
      console.log('Calling ML service at:', ML_SERVICE_URL);
      
      const response = await axios.post(`${ML_SERVICE_URL}/api/recommend`, {
        skills: userData.skills || [],
        interests: userData.interests || [],
        career_goals: userData.careerGoals || '',
        field_of_study: userData.fieldOfStudy || '',
        experience: userData.experience || 'Fresher',
        top_k: 5
      }, {
        timeout: 10000 // 10 second timeout
      });
      
      console.log('ML service response:', response.data);
      return response.data.recommendations;
    } catch (error) {
      console.error('ML Service Error:', error.message);
      
      // Fallback to simple recommendation if ML service is down
      console.log('Using fallback recommendation');
      return this.fallbackRecommendation(userData);
    }
  }
  
  fallbackRecommendation(userData) {
    // Simple fallback if ML service is down
    const skills = userData.skills || [];
    const interests = userData.interests || [];
    
    // Simple matching logic
    let recommendedCareer = 'Full Stack Developer';
    let matchScore = 75;
    
    if (skills.some(s => s.toLowerCase().includes('python') || s.toLowerCase().includes('data'))) {
      recommendedCareer = 'Data Scientist';
      matchScore = 80;
    } else if (interests.some(i => i.toLowerCase().includes('design'))) {
      recommendedCareer = 'UX/UI Designer';
      matchScore = 78;
    }
    
    return [{
      title: recommendedCareer,
      description: `Build a career in ${recommendedCareer}`,
      matchScore: matchScore,
      reason: 'Based on your profile and interests',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      currentSkills: skills.slice(0, 3),
      skillGap: ['React', 'Node.js', 'MongoDB'].filter(s => 
        !skills.some(us => us.toLowerCase().includes(s.toLowerCase()))
      ),
      icon: '💻'
    }];
  }
}

module.exports = new MLService();
