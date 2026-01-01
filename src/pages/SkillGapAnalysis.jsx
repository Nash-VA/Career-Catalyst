import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const SkillGapAnalysis = () => {
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
          <p className="text-gray-600 mb-6">Please complete your profile first to get career recommendations</p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const hasSkills = career.currentSkills || [];
  const missingSkills = career.skillGap || [];
  const totalSkills = career.requiredSkills?.length || 0;
  const completionPercentage = totalSkills > 0 ? Math.round((hasSkills.length / totalSkills) * 100) : 0;

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-primary mb-2">Skill Gap Analysis</h1>
          <p className="text-gray-600 text-lg">For {career.title}</p>
        </div>

        {/* Overall Progress Card */}
        <Card gradient className="text-center mb-8 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="text-left">
              <h3 className="text-3xl font-bold mb-1">Overall Progress</h3>
              <p className="text-secondary text-lg">Your skill completion rate</p>
            </div>
          </div>
          
          <div className="text-6xl font-bold mb-4">{career.matchScore}%</div>
          <p className="text-xl mb-6 opacity-90">
            You have {hasSkills.length} out of {totalSkills} required skills
          </p>
          
          <div className="w-full bg-white/30 rounded-full h-4 max-w-md mx-auto">
            <div 
              className="bg-secondary h-4 rounded-full transition-all duration-1000"
              style={{ width: `${career.matchScore}%` }}
            ></div>
          </div>
        </Card>

        {/* Skills Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Skills You Have */}
          <Card hover className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-dark flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                Skills You Have
              </h3>
              <span className="text-3xl font-bold text-green-600">{hasSkills.length}</span>
            </div>
            
            <div className="space-y-3">
              {hasSkills.length > 0 ? (
                hasSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-dark font-medium flex-1">{skill}</span>
                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">
                      Mastered
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No matching skills found yet</p>
                  <p className="text-sm mt-2">Start learning to build your skillset!</p>
                </div>
              )}
            </div>
          </Card>

          {/* Skills to Learn */}
          <Card hover className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-dark flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-orange-600" />
                </div>
                Skills to Learn
              </h3>
              <span className="text-3xl font-bold text-orange-600">{missingSkills.length}</span>
            </div>
            
            <div className="space-y-3">
              {missingSkills.map((skill, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                  <XCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <span className="text-dark font-medium flex-1">{skill}</span>
                  <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-semibold">
                    Learn Next
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* All Required Skills */}
        <Card className="mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-2xl font-bold text-primary mb-4">All Required Skills for {career.title}</h3>
          <div className="flex flex-wrap gap-3">
            {career.requiredSkills?.map((skill, idx) => {
              const hasSkill = hasSkills.includes(skill);
              return (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    hasSkill
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                  }`}
                >
                  {hasSkill && <CheckCircle className="w-4 h-4 inline mr-1" />}
                  {skill}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card hover className="cursor-pointer animate-slide-up" style={{ animationDelay: '0.4s' }} onClick={() => navigate('/roadmap')}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">View Learning Roadmap</h3>
                <p className="text-gray-600">Get a step-by-step plan to learn missing skills</p>
              </div>
              <ArrowRight className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card hover className="cursor-pointer animate-slide-up" style={{ animationDelay: '0.5s' }} onClick={() => navigate('/courses')}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Find Courses</h3>
                <p className="text-gray-600">Discover courses to bridge your skill gaps</p>
              </div>
              <ArrowRight className="w-8 h-8 text-primary" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
