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
  BarChart3
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { matchCareer } from '../utils/careerMatcher';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Dashboard = () => {
  const { userData, updateUserData } = useUser();
  const [recommendedCareer, setRecommendedCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      const career = matchCareer(userData);
      setRecommendedCareer(career);
      updateUserData({ recommendedCareer: career });
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const quickActions = [
    { 
      title: 'Skill Gap Analysis', 
      description: 'See what skills you need',
      icon: <BarChart3 size={24} />,
      link: '/skills',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Learning Roadmap', 
      description: 'Your personalized path',
      icon: <Rocket size={24} />,
      link: '/roadmap',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'Course Recommendations', 
      description: 'Find relevant courses',
      icon: <BookOpen size={24} />,
      link: '/courses',
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    { 
      title: 'Interview Prep', 
      description: 'Prepare for interviews',
      icon: <MessageSquare size={24} />,
      link: '/interview',
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-3xl font-bold text-primary mb-2">Analyzing Your Profile...</h2>
            <p className="text-gray-600 text-lg">Our AI is finding the perfect career match for you</p>
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-2 text-gray-600">
                <span>Processing resume...</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary">
                Welcome back!
              </h1>
              <p className="text-gray-600 text-lg">
                Here's your personalized career recommendation
              </p>
            </div>
          </div>
        </div>

        {/* Main Career Recommendation Card */}
        {recommendedCareer && (
          <Card className="mb-8 animate-slide-up border-l-4 border-primary">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
                  {recommendedCareer.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-3xl font-bold text-primary">{recommendedCareer.title}</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Best Match
                    </span>
                  </div>
                  <p className="text-gray-600 text-lg mb-4">{recommendedCareer.description}</p>
                  <div className="flex items-start gap-2 bg-blue-50 p-4 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-900">
                      <span className="font-semibold">Why this career?</span> {recommendedCareer.reason}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-5xl font-bold text-green-600 mb-1">
                  {recommendedCareer.matchScore}%
                </div>
                <p className="text-sm text-gray-500 font-medium">Match Score</p>
              </div>
            </div>

            {/* Skills Overview */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Skills You Have ({recommendedCareer.currentSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendedCareer.currentSkills.length > 0 ? (
                    recommendedCareer.currentSkills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Start building your skills</span>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Skills to Learn ({recommendedCareer.skillGap.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendedCareer.skillGap.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link to="/skills" className="flex-1">
                <Button className="w-full">View Detailed Skill Gap Analysis</Button>
              </Link>
              <Link to="/roadmap" className="flex-1">
                <Button variant="outline" className="w-full">Get Learning Roadmap</Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <Rocket className="w-6 h-6" />
            Next Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card 
                  hover 
                  className="h-full cursor-pointer animate-slide-up group transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`${action.bgColor} p-4 rounded-xl mb-4 inline-flex group-hover:scale-110 transition-transform duration-300`}>
                    <div className={action.iconColor}>
                      {action.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Progress Card */}
        <Card gradient className="text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">Your Progress</h3>
              <p className="text-secondary">Keep learning to reach your career goals</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Career Readiness</span>
              <span>{recommendedCareer?.matchScore}% Complete</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3">
              <div 
                className="bg-secondary h-3 rounded-full transition-all duration-1000" 
                style={{ width: `${recommendedCareer?.matchScore}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
