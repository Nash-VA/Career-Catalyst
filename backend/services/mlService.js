const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

class MLService {
  async generateRecommendations(userData) {
    try {
      console.log('🤖 Calling ML service at:', ML_SERVICE_URL);
      
      const response = await axios.post(`${ML_SERVICE_URL}/api/recommend`, {
        skills: userData.skills || [],
        interests: userData.interests || [],
        career_goals: userData.careerGoals || '',
        field_of_study: userData.fieldOfStudy || '',
        experience: userData.experience || 'Fresher',
        top_k: 5
      }, {
        timeout: 10000
      });
      
      console.log('✅ ML service response received');
      return response.data.recommendations;
      
    } catch (error) {
      console.error('❌ ML Service Error:', error.message);
      console.log('⚠️  Using enhanced fallback recommendation');
      return this.fallbackRecommendation(userData);
    }
  }
  
  fallbackRecommendation(userData) {
    const skills = (userData.skills || []).map(s => s.toLowerCase());
    const interests = (userData.interests || []).map(i => i.toLowerCase());
    const fieldOfStudy = (userData.fieldOfStudy || '').toLowerCase();

    console.log('📊 Analyzing for recommendation:', { 
      skills: skills.slice(0, 5), 
      interests: interests.slice(0, 5),
      fieldOfStudy 
    });

    // ========================================
    // MARKETING & DIGITAL MARKETING
    // ========================================
    if (
      skills.some(s => 
        s.includes('marketing') || s.includes('seo') || s.includes('social media') || 
        s.includes('content') || s.includes('advertising') || s.includes('branding')
      ) ||
      interests.some(i => 
        i.includes('marketing') || i.includes('advertising') || i.includes('social') ||
        i.includes('brand') || i.includes('promotion')
      ) ||
      fieldOfStudy.includes('marketing')
    ) {
      console.log('✅ Match: Digital Marketing Specialist');
      return [{
        title: 'Digital Marketing Specialist',
        description: 'Plan and execute digital marketing campaigns across various channels to reach target audiences and drive business growth',
        matchScore: 85,
        reason: 'Your marketing skills and digital strategy interest make this an excellent career fit',
        requiredSkills: ['SEO', 'Social Media Marketing', 'Content Strategy', 'Google Analytics', 'Email Marketing'],
        currentSkills: skills.slice(0, 5),
        skillGap: ['Advanced SEO', 'Marketing Automation', 'Data Analytics', 'PPC Advertising'],
        icon: '📱',
        averageSalary: '₹4,00,000 - ₹8,00,000',
        demandLevel: 'High',
        growthRate: '15%'
      }];
    }

    // ========================================
    // DATA SCIENCE & ANALYTICS
    // ========================================
    if (
      skills.some(s => 
        s.includes('python') || s.includes('data') || s.includes('sql') || 
        s.includes('analytics') || s.includes('statistics') || s.includes('tableau') ||
        s.includes('excel') || s.includes('r programming')
      ) ||
      interests.some(i => 
        i.includes('data') || i.includes('analytics') || i.includes('ai') || 
        i.includes('machine learning') || i.includes('statistics')
      ) ||
      fieldOfStudy.includes('data') || fieldOfStudy.includes('statistics')
    ) {
      console.log('✅ Match: Data Analyst');
      return [{
        title: 'Data Analyst',
        description: 'Analyze complex data sets to help businesses make informed decisions, create visualizations, and identify trends',
        matchScore: 88,
        reason: 'Your analytical skills and data interest align perfectly with this growing field',
        requiredSkills: ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics', 'Data Visualization'],
        currentSkills: skills.slice(0, 5),
        skillGap: ['Machine Learning', 'R Programming', 'Big Data Tools', 'Advanced Statistics'],
        icon: '📊',
        averageSalary: '₹5,00,000 - ₹10,00,000',
        demandLevel: 'Very High',
        growthRate: '20%'
      }];
    }

    // ========================================
    // DESIGN (UI/UX)
    // ========================================
    if (
      skills.some(s => 
        s.includes('design') || s.includes('figma') || s.includes('ui') || 
        s.includes('ux') || s.includes('photoshop') || s.includes('adobe') ||
        s.includes('wireframe') || s.includes('prototype')
      ) ||
      interests.some(i => 
        i.includes('design') || i.includes('creative') || i.includes('art') || 
        i.includes('ui') || i.includes('ux') || i.includes('visual')
      ) ||
      fieldOfStudy.includes('design')
    ) {
      console.log('✅ Match: UI/UX Designer');
      return [{
        title: 'UI/UX Designer',
        description: 'Create intuitive and visually appealing user interfaces and experiences for digital products',
        matchScore: 86,
        reason: 'Your creative skills and design thinking make you perfect for UI/UX design',
        requiredSkills: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
        currentSkills: skills.slice(0, 5),
        skillGap: ['User Testing', 'Interaction Design', 'Accessibility', 'Animation'],
        icon: '🎨',
        averageSalary: '₹4,50,000 - ₹12,00,000',
        demandLevel: 'High',
        growthRate: '18%'
      }];
    }

    // ========================================
    // BUSINESS & MANAGEMENT
    // ========================================
    if (
      skills.some(s => 
        s.includes('business') || s.includes('management') || s.includes('leadership') || 
        s.includes('strategy') || s.includes('finance') || s.includes('accounting')
      ) ||
      interests.some(i => 
        i.includes('business') || i.includes('management') || i.includes('entrepreneur') ||
        i.includes('finance') || i.includes('strategy')
      ) ||
      fieldOfStudy.includes('business') || fieldOfStudy.includes('mba') || fieldOfStudy.includes('commerce')
    ) {
      console.log('✅ Match: Business Analyst');
      return [{
        title: 'Business Analyst',
        description: 'Bridge the gap between business needs and technical solutions, analyze processes and recommend improvements',
        matchScore: 82,
        reason: 'Your business acumen and strategic thinking are perfect for this role',
        requiredSkills: ['Business Analysis', 'Requirements Gathering', 'SQL', 'Excel', 'Process Mapping'],
        currentSkills: skills.slice(0, 5),
        skillGap: ['Agile Methodology', 'Data Modeling', 'Stakeholder Management'],
        icon: '💼',
        averageSalary: '₹5,50,000 - ₹12,00,000',
        demandLevel: 'High',
        growthRate: '14%'
      }];
    }

    // ========================================
    // CONTENT & WRITING
    // ========================================
    if (
      skills.some(s => 
        s.includes('writing') || s.includes('content') || s.includes('communication') || 
        s.includes('copywriting') || s.includes('editing') || s.includes('blogging')
      ) ||
      interests.some(i => 
        i.includes('writing') || i.includes('content') || i.includes('blogging') ||
        i.includes('journalism') || i.includes('storytelling')
      )
    ) {
      console.log('✅ Match: Content Strategist');
      return [{
        title: 'Content Strategist',
        description: 'Create compelling content strategies and write engaging copy for various platforms and audiences',
        matchScore: 83,
        reason: 'Your communication skills and content interest are ideal for this creative role',
        requiredSkills: ['Content Writing', 'SEO Writing', 'Content Strategy', 'Storytelling', 'Editing'],
        currentSkills: skills.slice(0, 5),
        skillGap: ['Content Management Systems', 'Analytics', 'Social Media Strategy'],
        icon: '✍️',
        averageSalary: '₹3,50,000 - ₹8,00,000',
        demandLevel: 'Medium',
        growthRate: '12%'
      }];
    }

    // ========================================
    // WEB DEVELOPMENT
    // ========================================
    if (
      skills.some(s => 
        s.includes('react') || s.includes('javascript') || s.includes('html') || 
        s.includes('css') || s.includes('node') || s.includes('web') || 
        s.includes('frontend') || s.includes('backend') || s.includes('mongodb')
      ) ||
      interests.some(i => 
        i.includes('web') || i.includes('coding') || i.includes('programming') || 
        i.includes('development') || i.includes('software')
      ) ||
      fieldOfStudy.includes('computer') || fieldOfStudy.includes('software')
    ) {
      console.log('✅ Match: Full Stack Developer');
      return [{
        title: 'Full Stack Developer',
        description: 'Build complete web applications from frontend to backend, handling databases, servers, and client-side development',
        matchScore: 87,
        reason: 'Your web development skills and coding interest make this an ideal career path',
        requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'HTML/CSS', 'REST APIs'],
        currentSkills: skills.slice(0, 5),
        skillGap: ['TypeScript', 'Docker', 'AWS', 'System Design', 'Testing'],
        icon: '💻',
        averageSalary: '₹6,00,000 - ₹15,00,000',
        demandLevel: 'Very High',
        growthRate: '22%'
      }];
    }

    // ========================================
    // MOBILE DEVELOPMENT
    // ========================================
    if (
      skills.some(s => 
        s.includes('mobile') || s.includes('android') || s.includes('ios') || 
        s.includes('react native') || s.includes('flutter') || s.includes('swift')
      ) ||
      interests.some(i => 
        i.includes('mobile') || i.includes('app')
      )
    ) {
      console.log('✅ Match: Mobile App Developer');
      return [{
        title: 'Mobile App Developer',
        description: 'Create innovative mobile applications for Android and iOS platforms',
        matchScore: 84,
        reason: 'Your mobile development skills align with this rapidly growing field',
        requiredSkills: ['React Native', 'Flutter', 'Mobile UI', 'API Integration'],
        currentSkills: skills.slice(0, 5),
        skillGap: ['Native Development', 'App Store Optimization', 'Mobile Security'],
        icon: '📱',
        averageSalary: '₹5,50,000 - ₹14,00,000',
        demandLevel: 'High',
        growthRate: '19%'
      }];
    }

    // ========================================
    // DEFAULT FALLBACK
    // ========================================
    console.log('⚠️  No specific match found, using general tech recommendation');
    return [{
      title: 'Full Stack Developer',
      description: 'Build complete web applications from frontend to backend, handling databases, servers, and client-side development',
      matchScore: 70,
      reason: 'Based on general industry demand and versatile skill requirements',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'HTML/CSS', 'REST APIs'],
      currentSkills: skills.slice(0, 5),
      skillGap: ['TypeScript', 'Docker', 'AWS', 'System Design'],
      icon: '💻',
      averageSalary: '₹6,00,000 - ₹15,00,000',
      demandLevel: 'Very High',
      growthRate: '22%'
    }];
  }
}

module.exports = new MLService();
