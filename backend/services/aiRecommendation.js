const fs = require('fs');
const path = require('path');

class AICareerRecommendation {
  constructor() {
    try {
      // Load career dataset
      const dataPath = path.join(__dirname, '../data/career_dataset.json');
      
      // Check if file exists
      if (!fs.existsSync(dataPath)) {
        console.error('❌ Career dataset not found at:', dataPath);
        console.log('📁 Creating directory...');
        const dataDir = path.join(__dirname, '../data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        throw new Error('Please create career_dataset.json in backend/data/');
      }
      
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const parsedData = JSON.parse(rawData);
      
      // ✅ FIX: Access careers array correctly
      this.careers = parsedData.careers || [];
      
      console.log(`✅ Loaded ${this.careers.length} careers from dataset`);
      
    } catch (error) {
      console.error('❌ Error loading career dataset:', error.message);
      this.careers = [];
    }
  }

  /**
   * Calculate match score between user profile and career
   */
  calculateMatchScore(userProfile, career) {
    let score = 0;
    let totalWeight = 0;

    // Normalize inputs
    const userSkills = (userProfile.skills || []).map(s => s.toLowerCase().trim());
    const userInterests = (userProfile.interests || []).map(i => i.toLowerCase().trim());
    const userField = (userProfile.fieldOfStudy || '').toLowerCase();

    // 1. SKILLS MATCHING (Weight: 40%)
    const skillWeight = 0.4;
    let skillScore = 0;
    
    career.required_skills.forEach(reqSkill => {
      const reqSkillLower = reqSkill.toLowerCase();
      if (userSkills.some(s => s.includes(reqSkillLower) || reqSkillLower.includes(s))) {
        skillScore += 1;
      }
    });
    
    career.skill_keywords.forEach(keyword => {
      if (userSkills.some(s => s.includes(keyword) || keyword.includes(s))) {
        skillScore += 0.5;
      }
    });
    
    const maxSkillScore = career.required_skills.length + career.skill_keywords.length * 0.5;
    skillScore = maxSkillScore > 0 ? (skillScore / maxSkillScore) * skillWeight : 0;
    score += skillScore;
    totalWeight += skillWeight;

    // 2. INTERESTS MATCHING (Weight: 35%)
    const interestWeight = 0.35;
    let interestScore = 0;
    
    career.interest_keywords.forEach(keyword => {
      if (userInterests.some(i => i.includes(keyword) || keyword.includes(i))) {
        interestScore += 1;
      }
    });
    
    const maxInterestScore = career.interest_keywords.length;
    interestScore = maxInterestScore > 0 ? (interestScore / maxInterestScore) * interestWeight : 0;
    score += interestScore;
    totalWeight += interestWeight;

    // 3. EDUCATION MATCHING (Weight: 15%)
    const educationWeight = 0.15;
    let educationScore = 0;
    
    if (userField) {
      career.education.forEach(edu => {
        if (userField.includes(edu.toLowerCase()) || edu.toLowerCase().includes(userField)) {
          educationScore = educationWeight;
        }
      });
    }
    
    score += educationScore;
    totalWeight += educationWeight;

    // 4. EXPERIENCE LEVEL MATCHING (Weight: 10%)
    const experienceWeight = 0.1;
    let experienceScore = 0;
    
    if (userProfile.experience) {
      const userExp = userProfile.experience.toLowerCase();
      if (career.experience_levels.some(level => userExp.includes(level.toLowerCase()))) {
        experienceScore = experienceWeight;
      }
    }
    
    score += experienceScore;
    totalWeight += experienceWeight;

    // Normalize to 0-1 scale
    return totalWeight > 0 ? score / totalWeight : 0;
  }

  /**
   * Get top career recommendations
   */
  getRecommendations(userProfile, topK = 3) {
    if (this.careers.length === 0) {
      console.warn('⚠️  No careers loaded, using fallback');
      return this.getFallbackRecommendations(userProfile);
    }

    const scoredCareers = this.careers.map(career => ({
      ...career,
      matchScore: this.calculateMatchScore(userProfile, career),
      userSkills: userProfile.skills || []
    }));

    // Sort by score
    scoredCareers.sort((a, b) => b.matchScore - a.matchScore);

    // Filter careers above threshold
    let filteredCareers = scoredCareers.filter(
      career => career.matchScore >= career.match_threshold
    );

    // If no careers meet threshold, return top 3 anyway
    if (filteredCareers.length === 0) {
      filteredCareers = scoredCareers.slice(0, topK);
    } else {
      filteredCareers = filteredCareers.slice(0, topK);
    }

    return filteredCareers.map(career => this.formatRecommendation(career));
  }

  /**
   * Format recommendation for response
   */
  formatRecommendation(career) {
    const userSkills = career.userSkills || [];
    const skillGap = career.required_skills.filter(
      reqSkill => !userSkills.some(s => 
        s.toLowerCase().includes(reqSkill.toLowerCase())
      )
    );

    return {
      title: career.title,
      category: career.category,
      description: career.description,
      matchScore: Math.round(career.matchScore * 100),
      reason: this.generateReason(career.matchScore, career.title),
      requiredSkills: career.required_skills.slice(0, 6),
      currentSkills: userSkills.slice(0, 5),
      skillGap: skillGap.slice(0, 4),
      averageSalary: career.average_salary,
      demandLevel: career.demand_level,
      growthRate: career.growth_rate,
      icon: this.getCareerIcon(career.category)
    };
  }

  /**
   * Generate personalized reason
   */
  generateReason(matchScore, careerTitle) {
    if (matchScore >= 0.8) {
      return `Excellent match! Your skills and interests align perfectly with ${careerTitle}`;
    } else if (matchScore >= 0.6) {
      return `Strong match for ${careerTitle}. Your profile shows good alignment with this career path`;
    } else if (matchScore >= 0.4) {
      return `Good potential for ${careerTitle}. With some skill development, this could be a great fit`;
    } else {
      return `${careerTitle} is an option worth exploring based on your profile and market demand`;
    }
  }

  /**
   * Get icon for career category
   */
  getCareerIcon(category) {
    const icons = {
      'Software Development': '💻',
      'Data Science': '📊',
      'Marketing': '📱',
      'Design': '🎨',
      'Business': '💼',
      'Content & Writing': '✍️',
      'Product Management': '🚀',
      'Security': '🔒'
    };
    return icons[category] || '💼';
  }

  /**
   * Fallback recommendations if dataset fails
   */
  getFallbackRecommendations(userProfile) {
    return [{
      title: 'Full Stack Developer',
      category: 'Software Development',
      description: 'Build complete web applications',
      matchScore: 70,
      reason: 'General recommendation based on industry demand',
      requiredSkills: ['React', 'Node.js', 'MongoDB'],
      currentSkills: userProfile.skills?.slice(0, 3) || [],
      skillGap: ['TypeScript', 'Docker'],
      averageSalary: '₹6,00,000 - ₹15,00,000',
      demandLevel: 'Very High',
      growthRate: '22%',
      icon: '💻'
    }];
  }
}

module.exports = new AICareerRecommendation();
