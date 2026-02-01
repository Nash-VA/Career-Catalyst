const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/career-catalyst')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const users = await User.find({});
    
    console.log(`📊 Total Users: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`\n👤 User ${index + 1}:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Onboarding: ${user.onboardingCompleted ? '✅' : '❌'}`);
      console.log(`   Recommended Career: ${user.recommendedCareer?.title || 'Not set'}`);
      console.log(`   Skills: ${user.skills?.length || 0}`);
      console.log(`   Interests: ${user.interests?.length || 0}`);
      console.log(`   Created: ${user.createdAt}`);
    });
    
    process.exit();
  })
  .catch(err => {
    console.error('❌ MongoDB Error:', err);
    process.exit(1);
  });
