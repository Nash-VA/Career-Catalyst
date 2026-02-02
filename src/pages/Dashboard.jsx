import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Award,
  CheckCircle2,
  Clock,
  Brain,
  Rocket,
  Sparkles,
  BarChart3,
  ArrowRight,
  AlertCircle,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { matchCareer } from '../utils/careerMatcher';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const Dashboard = () => {
  const { userData, updateUserData } = useUser();
  const [recommendedCareer, setRecommendedCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CHECK IF DATA ALREADY EXISTS
    if (userData.recommendedCareer) {
      setRecommendedCareer(userData.recommendedCareer);
      setLoading(false);
    } else {
      // No data - analyze and generate (ONLY FIRST TIME)
      const timer = setTimeout(() => {
        const career = matchCareer(userData);
        setRecommendedCareer(career);
        updateUserData({ recommendedCareer: career });
        setLoading(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [userData.recommendedCareer, updateUserData, userData]);

  const quickActions = [
    { 
      title: 'Skill Gap Analysis', 
      description: 'Identify and address skill gaps',
      icon: BarChart3,
      link: '/skills',
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    { 
      title: 'Learning Roadmap', 
      description: 'Structured learning pathway',
      icon: Rocket,
      link: '/roadmap',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    { 
      title: 'Course Library', 
      description: 'Curated learning resources',
      icon: BookOpen,
      link: '/courses',
      iconColor: 'text-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200'
    },
    { 
      title: 'Interview Preparation', 
      description: 'Practice and improve',
      icon: MessageSquare,
      link: '/interview',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <Loading 
            message="Analyzing Your Profile" 
            submessage="Generating personalized career recommendations"
          />
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2 text-gray-600">
              <span>Processing data</span>
              <span>85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ IMPROVED LOGIC CALCULATIONS
  // We sum acquired skills and gaps to get the TRUE total required.
  const skillsAcquired = recommendedCareer?.currentSkills?.length || 0;
  const skillsToLearn = recommendedCareer?.skillGap?.length || 0;
  const totalSkillsRequired = skillsAcquired + skillsToLearn;

  // Completion percentage now reflects reality (prevents the 100% bug)
  const completionPercentage = totalSkillsRequired > 0 
    ? Math.round((skillsAcquired / totalSkillsRequired) * 100) 
    : 0;

  // Calculation Logic: Readiness is a blend of natural fit (40%) and progress (60%)
  const overallReadiness = Math.round(
    ((recommendedCareer?.matchScore || 0) * 0.4) + (completionPercentage * 0.6)
  );

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Career Dashboard
              </h1>
              <p className="text-gray-600">
                Your personalized career development overview
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Insights</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Match Score</span>
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {recommendedCareer?.matchScore}%
            </div>
            <p className="text-xs text-green-600 font-medium">Potential fit</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Skills Acquired</span>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {skillsAcquired}
            </div>
            <p className="text-xs text-gray-500">of {totalSkillsRequired} total</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Skills Needed</span>
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {skillsToLearn}
            </div>
            <p className="text-xs text-gray-500">to master</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Completion</span>
              <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-violet-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {completionPercentage}%
            </div>
            <p className="text-xs text-gray-500">learning rate</p>
          </div>
        </div>

        {/* Main Career Recommendation Card */}
        {recommendedCareer && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
            
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
                    {recommendedCareer.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {recommendedCareer.title}
                      </h2>
                      <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold whitespace-nowrap">
                        Top Match
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {recommendedCareer.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Insight Box */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Why This Career Path?
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {recommendedCareer.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Skills Acquired
                    </h3>
                    <span className="ml-auto text-sm font-medium text-gray-500">
                      {skillsAcquired}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {recommendedCareer.currentSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {recommendedCareer.currentSkills.map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-400 border border-dashed border-gray-200 rounded-lg">
                        <p className="text-sm">No skills matched yet</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-md flex items-center justify-center">
                      <Clock className="w-4 h-4 text-orange-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Skills to Learn
                    </h3>
                    <span className="ml-auto text-sm font-medium text-gray-500">
                      {skillsToLearn}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recommendedCareer.skillGap.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <Link to="/skills" className="flex-1">
                  <button className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    View Skill Analysis
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link to="/roadmap" className="flex-1">
                  <button className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Rocket className="w-4 h-4" />
                    Get Learning Path
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recommended Actions
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group h-full">
                  <div className={`${action.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {action.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Career Progress</h3>
              <p className="text-white/80">
                Track your journey to becoming a {recommendedCareer?.title}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Overall Readiness</span>
              {/* ✅ Uses the new calculated readiness variable */}
              <span className="font-bold">{overallReadiness}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-1000 shadow-lg" 
                style={{ width: `${overallReadiness}%` }}
              ></div>
            </div>

            
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white/80 text-xs mb-1">Skills</p>
                <p className="text-xl font-bold">{skillsAcquired}/{totalSkillsRequired}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white/80 text-xs mb-1">Completion</p>
                <p className="text-xl font-bold">{completionPercentage}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white/80 text-xs mb-1">To Learn</p>
                <p className="text-xl font-bold">{skillsToLearn}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;