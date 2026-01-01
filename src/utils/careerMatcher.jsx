// Career matching algorithm with dummy data
export const careerDatabase = {
  'Full Stack Developer': {
    title: 'Full Stack Developer',
    description: 'Build complete web applications from front-end to back-end using modern technologies',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API', 'Git', 'HTML', 'CSS', 'Express'],
    keywords: ['javascript', 'react', 'node', 'web', 'frontend', 'backend', 'fullstack', 'html', 'css'],
    icon: '💻'
  },
  'Data Scientist': {
    title: 'Data Scientist',
    description: 'Analyze complex data sets and build predictive models using machine learning',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Pandas', 'NumPy', 'Data Visualization', 'TensorFlow'],
    keywords: ['python', 'data', 'machine learning', 'ml', 'ai', 'statistics', 'analytics', 'pandas'],
    icon: '📊'
  },
  'UX/UI Designer': {
    title: 'UX/UI Designer',
    description: 'Create user-centered digital experiences and beautiful interfaces',
    requiredSkills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'HTML', 'CSS', 'Design Thinking', 'Wireframing'],
    keywords: ['design', 'ui', 'ux', 'figma', 'adobe', 'creative', 'wireframe', 'prototype'],
    icon: '🎨'
  },
  'DevOps Engineer': {
    title: 'DevOps Engineer',
    description: 'Automate and optimize software deployment and infrastructure',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Jenkins', 'Terraform', 'Python'],
    keywords: ['devops', 'docker', 'kubernetes', 'aws', 'cloud', 'automation', 'linux', 'infrastructure'],
    icon: '⚙️'
  },
  'Mobile App Developer': {
    title: 'Mobile App Developer',
    description: 'Create native and cross-platform mobile applications',
    requiredSkills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'REST API', 'Git', 'Mobile UI/UX'],
    keywords: ['mobile', 'react native', 'flutter', 'ios', 'android', 'app', 'swift', 'kotlin'],
    icon: '📱'
  },
  'AI/ML Engineer': {
    title: 'AI/ML Engineer',
    description: 'Develop artificial intelligence and machine learning solutions',
    requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'Mathematics', 'Neural Networks'],
    keywords: ['ai', 'ml', 'machine learning', 'deep learning', 'neural', 'tensorflow', 'pytorch', 'nlp'],
    icon: '🤖'
  },
  'Cloud Architect': {
    title: 'Cloud Architect',
    description: 'Design and implement cloud infrastructure solutions',
    requiredSkills: ['AWS', 'Azure', 'GCP', 'Cloud Architecture', 'Microservices', 'Docker', 'Kubernetes', 'Networking'],
    keywords: ['cloud', 'aws', 'azure', 'gcp', 'architecture', 'infrastructure', 'serverless'],
    icon: '☁️'
  },
  'Cybersecurity Analyst': {
    title: 'Cybersecurity Analyst',
    description: 'Protect systems and networks from security threats',
    requiredSkills: ['Network Security', 'Ethical Hacking', 'SIEM', 'Risk Assessment', 'Cryptography', 'Linux', 'Python', 'Penetration Testing'],
    keywords: ['security', 'cybersecurity', 'hacking', 'penetration', 'network', 'encryption', 'firewall'],
    icon: '🔒'
  },
  'Frontend Developer': {
    title: 'Frontend Developer',
    description: 'Build beautiful and responsive user interfaces',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Responsive Design', 'Git', 'TypeScript'],
    keywords: ['frontend', 'html', 'css', 'javascript', 'react', 'vue', 'angular', 'web'],
    icon: '🖥️'
  },
  'Backend Developer': {
    title: 'Backend Developer',
    description: 'Develop server-side logic and database management',
    requiredSkills: ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'REST API', 'GraphQL', 'Microservices'],
    keywords: ['backend', 'server', 'api', 'database', 'node', 'python', 'java', 'sql'],
    icon: '🔧'
  },
  'Product Manager': {
    title: 'Product Manager',
    description: 'Lead product strategy and development from concept to launch',
    requiredSkills: ['Product Strategy', 'User Research', 'Agile', 'Data Analysis', 'Communication', 'Roadmapping', 'Stakeholder Management'],
    keywords: ['product', 'management', 'strategy', 'agile', 'scrum', 'planning', 'roadmap'],
    icon: '📋'
  },
  'Digital Marketing Specialist': {
    title: 'Digital Marketing Specialist',
    description: 'Create and execute digital marketing campaigns',
    requiredSkills: ['SEO', 'SEM', 'Google Analytics', 'Content Marketing', 'Social Media', 'Email Marketing', 'Copywriting'],
    keywords: ['marketing', 'digital', 'seo', 'sem', 'social media', 'content', 'advertising'],
    icon: '📢'
  }
};

export const matchCareer = (userData) => {
  const skills = (userData.skills || []).map(s => s.toLowerCase());
  const interests = (userData.interests || []).map(i => i.toLowerCase());
  const goals = (userData.careerGoals || '').toLowerCase();
  const fieldOfStudy = (userData.fieldOfStudy || '').toLowerCase();
  
  let bestMatch = null;
  let highestScore = 0;

  // Check each career in database
  Object.values(careerDatabase).forEach(career => {
    let score = 0;
    
    // Match skills
    career.requiredSkills.forEach(reqSkill => {
      if (skills.some(userSkill => 
        userSkill.includes(reqSkill.toLowerCase()) || 
        reqSkill.toLowerCase().includes(userSkill)
      )) {
        score += 10;
      }
    });

    // Match keywords with interests
    career.keywords.forEach(keyword => {
      if (interests.some(interest => interest.includes(keyword) || keyword.includes(interest))) {
        score += 8;
      }
    });

    // Match keywords with goals
    career.keywords.forEach(keyword => {
      if (goals.includes(keyword)) {
        score += 5;
      }
    });

    // Match with field of study
    career.keywords.forEach(keyword => {
      if (fieldOfStudy.includes(keyword)) {
        score += 6;
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestMatch = career;
    }
  });

  // Default to Full Stack Developer if no good match
  if (!bestMatch || highestScore < 10) {
    bestMatch = careerDatabase['Full Stack Developer'];
    highestScore = 75;
  }

  // Calculate match percentage (normalize to 70-95%)
  const matchScore = Math.min(95, Math.max(70, 70 + (highestScore / 2)));

  // Find current skills user has
  const currentSkills = bestMatch.requiredSkills.filter(reqSkill =>
    skills.some(userSkill => 
      userSkill.includes(reqSkill.toLowerCase()) || 
      reqSkill.toLowerCase().includes(userSkill)
    )
  );

  // Find skill gaps
  const skillGap = bestMatch.requiredSkills.filter(reqSkill =>
    !currentSkills.some(current => 
      current.toLowerCase() === reqSkill.toLowerCase()
    )
  ).slice(0, 5); // Limit to 5 gaps

  return {
    title: bestMatch.title,
    description: bestMatch.description,
    matchScore: Math.round(matchScore),
    reason: generateReason(bestMatch, currentSkills, interests, userData),
    requiredSkills: bestMatch.requiredSkills,
    currentSkills: currentSkills,
    skillGap: skillGap,
    icon: bestMatch.icon
  };
};

const generateReason = (career, currentSkills, interests, userData) => {
  const reasons = [];
  
  if (currentSkills.length > 0) {
    reasons.push(`your ${currentSkills.slice(0, 2).join(' and ')} skills`);
  }
  
  if (interests.length > 0) {
    reasons.push(`your interest in ${interests[0]}`);
  }
  
  if (userData.experience && userData.experience !== 'Fresher') {
    reasons.push(`your ${userData.experience} of experience`);
  }

  if (reasons.length === 0) {
    return `your educational background in ${userData.fieldOfStudy || 'technology'} and career aspirations`;
  }

  return `Based on ${reasons.join(', ')}, you're well-suited for this role`;
};
