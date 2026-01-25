import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, TrendingUp, Loader2, Sparkles, Target, BookOpen, Map } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';


const SkillGapAnalysis = () => {
  const { userData } = useUser();
  const navigate = useNavigate();
  const career = userData.recommendedCareer;
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false); // FALSE by default!


  useEffect(() => {
    const fetchAIAnalysis = async () => {
      if (!career) return;

      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/skill-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_skills: career.currentSkills || [],
            required_skills: career.requiredSkills || [],
            career_title: career.title
          })
        });

        const data = await response.json();
        if (data.success) {
          setAiAnalysis(data);
        }
      } catch (error) {
        console.error('Failed to fetch AI analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAIAnalysis();
  }, [career]);

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

  const getPriorityLevel = (index) => {
    if (index < 2) return { label: 'High', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-300', badgeBg: 'bg-red-200' };
    if (index < 4) return { label: 'Medium', bgColor: 'bg-orange-50', textColor: 'text-orange-700', borderColor: 'border-orange-300', badgeBg: 'bg-orange-200' };
    return { label: 'Low', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-300', badgeBg: 'bg-yellow-200' };
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Clean Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Skill Gap Analysis</h1>
          </div>
          <p className="text-gray-600 text-base pl-11">
            Career readiness insights for <span className="font-semibold text-primary">{career.title}</span>
          </p>
        </div>

        {/* AI Analysis - Compact Border Design */}
       {loading ? (
            <div className="mb-6">
              <Loading 
                message="Analyzing Your Skills..." 
                submessage="AI is evaluating your skill profile and career readiness"
              />
            </div>
          ) : aiAnalysis ? (
          <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-primary p-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-dark mb-2">AI Career Readiness Analysis</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {aiAnalysis.analysis}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <div className="bg-primary/10 px-3 py-1.5 rounded-full">
                    <span className="font-semibold text-primary">Completion: {aiAnalysis.completion_rate || completionPercentage}%</span>
                  </div>
                  <div className="bg-gray-100 px-3 py-1.5 rounded-full">
                    <span className="font-semibold text-gray-700">Skills to Learn: {missingSkills.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Progress Card - Compact Horizontal Design */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-dark mb-1">Overall Progress</h3>
              <p className="text-sm text-gray-600">{hasSkills.length} of {totalSkills} skills acquired</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{completionPercentage}%</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-1000"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          {/* Milestones - Compact */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`w-10 h-10 rounded-full mx-auto mb-1.5 flex items-center justify-center ${
                completionPercentage >= 33 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                <CheckCircle size={18} />
              </div>
              <p className="text-xs text-gray-600 font-medium">Beginner</p>
            </div>
            <div className="text-center">
              <div className={`w-10 h-10 rounded-full mx-auto mb-1.5 flex items-center justify-center ${
                completionPercentage >= 66 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                <CheckCircle size={18} />
              </div>
              <p className="text-xs text-gray-600 font-medium">Intermediate</p>
            </div>
            <div className="text-center">
              <div className={`w-10 h-10 rounded-full mx-auto mb-1.5 flex items-center justify-center ${
                completionPercentage >= 90 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                <CheckCircle size={18} />
              </div>
              <p className="text-xs text-gray-600 font-medium">Expert</p>
            </div>
          </div>
        </div>

        {/* Skills Grid - Cleaner Design */}
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {/* Skills You Have */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-dark flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                Skills Acquired
              </h3>
              <span className="text-2xl font-bold text-green-600">{hasSkills.length}</span>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {hasSkills.length > 0 ? (
                hasSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 bg-green-50 rounded-lg border border-green-200 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-dark font-medium flex-1">{skill}</span>
                    <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-full text-xs font-semibold">
                      ✓
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <XCircle className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm font-medium">No skills matched yet</p>
                  <p className="text-xs mt-1">Start learning!</p>
                </div>
              )}
            </div>
          </Card>

          {/* Skills to Learn */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-dark flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                Skills to Learn
              </h3>
              <span className="text-2xl font-bold text-orange-600">{missingSkills.length}</span>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {missingSkills.length > 0 ? (
                missingSkills.map((skill, idx) => {
                  const priority = getPriorityLevel(idx);
                  return (
                    <div key={idx} className={`flex items-center gap-2.5 p-3 ${priority.bgColor} rounded-lg border ${priority.borderColor} text-sm`}>
                      <div className="flex items-center gap-2 flex-1">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priority.textColor.replace('text-', 'bg-')}`}></span>
                        <span className="text-dark font-medium">{skill}</span>
                      </div>
                      <span className={`px-2 py-0.5 ${priority.badgeBg} ${priority.textColor} rounded-full text-xs font-semibold`}>
                        {priority.label}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-green-500">
                  <CheckCircle className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm font-medium">All skills acquired!</p>
                  <p className="text-xs mt-1 text-gray-600">Keep practicing</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* All Required Skills - Compact */}
        <Card className="mb-6">
          <h3 className="text-base font-bold text-primary mb-3">All Required Skills for {career.title}</h3>
          <div className="flex flex-wrap gap-2">
            {career.requiredSkills?.map((skill, idx) => {
              const hasSkill = hasSkills.includes(skill);
              return (
                <div
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg font-medium text-sm ${
                    hasSkill
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  {hasSkill ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <XCircle className="w-3 h-3 inline mr-1 opacity-40" />}
                  {skill}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action Cards - Cleaner */}
        <div className="grid md:grid-cols-2 gap-5">
          <div 
            onClick={() => navigate('/roadmap')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                <Map className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-primary mb-1 group-hover:text-primary-dark">
                  Learning Roadmap
                </h3>
                <p className="text-sm text-gray-600">Get an AI-powered step-by-step plan</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/courses')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                <BookOpen className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-primary mb-1 group-hover:text-primary-dark">
                  Find Courses
                </h3>
                <p className="text-sm text-gray-600">Discover AI-curated courses</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
