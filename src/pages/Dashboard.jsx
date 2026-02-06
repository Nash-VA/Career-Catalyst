import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  CheckCircle2,
  Clock,
  Brain,
  Rocket,
  BarChart3,
  ArrowRight,
  Zap,
  ChevronRight,
  AlertTriangle,
  Briefcase
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import Navbar from '../components/layout/Navbar';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';

const Dashboard = () => {
  const { userData, loading: contextLoading } = useUser();
  const navigate = useNavigate();
  
  // We use local state to ensure smooth transition
  const [careerData, setCareerData] = useState(null);

  // Sync Context Data to Local State
  useEffect(() => {
    if (userData?.recommendedCareer) {
      setCareerData(userData.recommendedCareer);
    }
  }, [userData]);

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

  // 1. Loading State
  if (contextLoading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <Loading 
            message="Syncing Profile" 
            submessage="Retrieving your career data..."
          />
        </div>
      </div>
    );
  }

  // 2. Empty State (If user hasn't done onboarding or DB is empty)
  if (!careerData && !contextLoading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="max-w-md text-center p-8">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Career Path Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't retrieve your career recommendation. Please complete the onboarding process to generate your path.
            </p>
            <button 
              onClick={() => navigate('/onboarding')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              Go to Onboarding
            </button>
          </Card>
        </div>
      </div>
    );
  }

  // 3. Safe Data Calculation
  // Ensure arrays exist so the app doesn't crash
  const currentSkills = careerData.currentSkills || [];
  const skillGap = careerData.skillGap || [];
  
  const skillsAcquiredCount = currentSkills.length;
  const skillsToLearnCount = skillGap.length;
  const totalSkillsRequired = skillsAcquiredCount + skillsToLearnCount;

  const completionPercentage = totalSkillsRequired > 0 
    ? Math.round((skillsAcquiredCount / totalSkillsRequired) * 100) 
    : 0;

  // Use DB match score or calculate a fallback
  const matchScore = careerData.matchScore || Math.round(70 + (completionPercentage * 0.3));

  const overallReadiness = Math.round(
    (matchScore * 0.4) + (completionPercentage * 0.6)
  );

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Career Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {userData?.name || 'Explorer'}. Here is your progress.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Insights</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Match Score</span>
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {matchScore}%
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
              {skillsAcquiredCount}
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
              {skillsToLearnCount}
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

        {/* Main Career Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
          
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl flex-shrink-0 shadow-lg">
                  {/* Fallback Icon if not present in DB */}
                  <Briefcase />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {careerData.title}
                    </h2>
                    <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold whitespace-nowrap">
                      Top Match
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {careerData.description}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Reason Section */}
            {careerData.reason && (
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
                      {careerData.reason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Breakdown Grid */}
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
                    {skillsAcquiredCount}
                  </span>
                </div>
                <div className="space-y-2">
                  {currentSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentSkills.map((skill, idx) => (
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
                      <p className="text-sm">No matching skills yet</p>
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
                    {skillsToLearnCount}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGap.map((skill, idx) => (
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

        {/* Quick Actions Grid */}
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

        {/* Progress Summary Card */}
        <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Career Progress</h3>
              <p className="text-white/80">
                Track your journey to becoming a {careerData.title}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Overall Readiness</span>
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
                <p className="text-xl font-bold">{skillsAcquiredCount}/{totalSkillsRequired}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white/80 text-xs mb-1">Completion</p>
                <p className="text-xl font-bold">{completionPercentage}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white/80 text-xs mb-1">To Learn</p>
                <p className="text-xl font-bold">{skillsToLearnCount}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;