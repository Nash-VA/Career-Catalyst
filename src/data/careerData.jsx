export const careers = [
  {
    id: 1,
    title: 'Full Stack Developer',
    description: 'Build end-to-end web applications using modern technologies',
    matchScore: 0,
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API', 'Git', 'HTML', 'CSS'],
    salaryRange: '$70,000 - $120,000',
    demandLevel: 'High',
    growthRate: '22%',
    category: 'Software Development'
  },
  {
    id: 2,
    title: 'Data Scientist',
    description: 'Analyze complex data sets and build predictive models',
    matchScore: 0,
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow', 'Pandas', 'Data Visualization'],
    salaryRange: '$80,000 - $150,000',
    demandLevel: 'Very High',
    growthRate: '31%',
    category: 'Data Science'
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    description: 'Design user-centered digital experiences',
    matchScore: 0,
    requiredSkills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'HTML', 'CSS', 'Design Thinking'],
    salaryRange: '$60,000 - $110,000',
    demandLevel: 'High',
    growthRate: '18%',
    category: 'Design'
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    description: 'Automate and optimize software deployment processes',
    matchScore: 0,
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Python', 'Terraform'],
    salaryRange: '$85,000 - $140,000',
    demandLevel: 'Very High',
    growthRate: '27%',
    category: 'Infrastructure'
  },
  {
    id: 5,
    title: 'Mobile App Developer',
    description: 'Create native and cross-platform mobile applications',
    matchScore: 0,
    requiredSkills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'REST API', 'Git'],
    salaryRange: '$75,000 - $130,000',
    demandLevel: 'High',
    growthRate: '24%',
    category: 'Mobile Development'
  },
  {
    id: 6,
    title: 'AI/ML Engineer',
    description: 'Develop artificial intelligence and machine learning solutions',
    matchScore: 0,
    requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP', 'Computer Vision', 'Mathematics'],
    salaryRange: '$90,000 - $160,000',
    demandLevel: 'Very High',
    growthRate: '40%',
    category: 'Artificial Intelligence'
  },
  {
    id: 7,
    title: 'Cybersecurity Analyst',
    description: 'Protect systems and networks from security threats',
    matchScore: 0,
    requiredSkills: ['Network Security', 'Ethical Hacking', 'SIEM', 'Risk Assessment', 'Cryptography', 'Linux', 'Python'],
    salaryRange: '$75,000 - $135,000',
    demandLevel: 'Very High',
    growthRate: '33%',
    category: 'Security'
  },
  {
    id: 8,
    title: 'Cloud Architect',
    description: 'Design and implement cloud infrastructure solutions',
    matchScore: 0,
    requiredSkills: ['AWS', 'Azure', 'GCP', 'Cloud Architecture', 'Microservices', 'Docker', 'Kubernetes'],
    salaryRange: '$100,000 - $170,000',
    demandLevel: 'Very High',
    growthRate: '29%',
    category: 'Cloud Computing'
  }
];

export const courses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    provider: 'Udemy',
    duration: '65 hours',
    level: 'Beginner',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    rating: 4.8,
    price: '$89.99'
  },
  {
    id: 2,
    title: 'Machine Learning Specialization',
    provider: 'Coursera',
    duration: '3 months',
    level: 'Intermediate',
    skills: ['Python', 'Machine Learning', 'TensorFlow'],
    rating: 4.9,
    price: '$49/month'
  },
  {
    id: 3,
    title: 'AWS Certified Solutions Architect',
    provider: 'A Cloud Guru',
    duration: '40 hours',
    level: 'Intermediate',
    skills: ['AWS', 'Cloud Architecture', 'DevOps'],
    rating: 4.7,
    price: '$39/month'
  },
  {
    id: 4,
    title: 'UI/UX Design Masterclass',
    provider: 'Skillshare',
    duration: '12 hours',
    level: 'Beginner',
    skills: ['Figma', 'User Research', 'Prototyping'],
    rating: 4.6,
    price: '$15/month'
  },
  {
    id: 5,
    title: 'Python for Data Science',
    provider: 'DataCamp',
    duration: '44 hours',
    level: 'Beginner',
    skills: ['Python', 'Pandas', 'Data Visualization'],
    rating: 4.7,
    price: '$25/month'
  }
];

export const interviewQuestions = {
  'Full Stack Developer': [
    'Explain the difference between REST and GraphQL',
    'How do you optimize website performance?',
    'What is your experience with version control systems?',
    'Describe a challenging bug you fixed',
    'How do you handle authentication and authorization?'
  ],
  'Data Scientist': [
    'Explain the bias-variance tradeoff',
    'How do you handle missing data?',
    'What is your approach to feature engineering?',
    'Describe a machine learning project you completed',
    'How do you evaluate model performance?'
  ],
  'UX/UI Designer': [
    'Walk me through your design process',
    'How do you conduct user research?',
    'Describe a time you had to defend your design decisions',
    'How do you ensure accessibility in your designs?',
    'What tools do you use for prototyping?'
  ]
};
