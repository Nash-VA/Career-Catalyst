import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, TrendingUp, CheckCircle2, Clock, Brain, ArrowRight, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const CareerRecommendation = () => {
  const { userData } = useUser();
  const navigate = useNavigate();
  const career = userData.recommendedCareer;

  if (!career) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">No Career Recommendation Yet</h2>
          <p className="text-gray-600 mb-6">Please complete your onboarding to get your personalized career recommendation</p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-primary mb-2">Your Career Recommendation</h1>
          <p className="text-gray-600 text-lg">
            AI-powered career path based on your profile analysis
          </p>
        </div>

        {/* Main Career Card */}
        <Card className="mb-8 animate-slide-up border-l-4 border-primary">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl">
                {career.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-4xl font-bold text-primary">{career.title}</h2>
                  <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    Best Match
                  </span>
                </div>
                <p className="text-gray-600 text-xl mb-4">{career.description}</p>
                <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Why this career is perfect for you:</p>
                    <p className="text-blue-800">{career.reason}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0 ml-6">
              <div className="text-6xl font-bold text-green-600 mb-2">
                {career.matchScore}%
              </div>
              <p className="text-sm text-gray-500 font-medium">Match Score</p>
              <div className="mt-4 w-32 h-32 relative">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - career.matchScore / 100)}`}
                    className="text-green-600 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-10 h-10 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h3 className="font-bold text-dark mb-4 flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                Skills You Have ({career.currentSkills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {career.currentSkills?.length > 0 ? (
                  career.currentSkills.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 bg-green-200 text-green-800 rounded-full text-sm font-semibold">
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">Start building your skills</span>
                )}
              </div>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <h3 className="font-bold text-dark mb-4 flex items-center gap-2 text-lg">
                <Clock className="w-6 h-6 text-orange-600" />
                Skills to Learn ({career.skillGap?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {career.skillGap?.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-orange-200 text-orange-800 rounded-full text-sm font-semibold">
                    → {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* All Required Skills */}
          <div className="bg-gray-50 p-6 rounded-xl mb-6">
            <h3 className="font-bold text-dark mb-3 text-lg">All Required Skills for this Career:</h3>
            <div className="flex flex-wrap gap-2">
              {career.requiredSkills?.map((skill, idx) => (
                <span 
                  key={idx} 
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    career.currentSkills?.includes(skill)
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/skills')} className="w-full flex items-center justify-center gap-2">
              View Skill Analysis
              <ArrowRight size={18} />
            </Button>
            <Button onClick={() => navigate('/roadmap')} variant="outline" className="w-full flex items-center justify-center gap-2">
              Get Learning Roadmap
              <ArrowRight size={18} />
            </Button>
            <Button onClick={() => navigate('/courses')} variant="secondary" className="w-full flex items-center justify-center gap-2">
              Find Courses
              <ArrowRight size={18} />
            </Button>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card hover className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-dark mb-1">Career Ready</h3>
            <p className="text-3xl font-bold text-primary mb-1">{career.matchScore}%</p>
            <p className="text-gray-600 text-sm">Current readiness level</p>
          </Card>

          <Card hover className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-dark mb-1">Skills Acquired</h3>
            <p className="text-3xl font-bold text-green-600 mb-1">{career.currentSkills?.length || 0}</p>
            <p className="text-gray-600 text-sm">Out of {career.requiredSkills?.length || 0} required</p>
          </Card>

          <Card hover className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-dark mb-1">To Learn</h3>
            <p className="text-3xl font-bold text-orange-600 mb-1">{career.skillGap?.length || 0}</p>
            <p className="text-gray-600 text-sm">Skills remaining</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareerRecommendation;
