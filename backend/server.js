const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/admin', adminRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes - VERIFY ALL FOUR ARE HERE
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));  // ← Must have this
app.use('/api/resume', require('./routes/resume'));
app.use('/api/recommendation', require('./routes/recommendation'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('✅ Routes loaded:');
  console.log('   POST /api/auth/signup');
  console.log('   POST /api/auth/login');
  console.log('   GET  /api/auth/me');
  console.log('   PUT  /api/user/update-onboarding  ← Check this');
  console.log('   POST /api/recommendation/generate');
  console.log('='.repeat(50));
});
