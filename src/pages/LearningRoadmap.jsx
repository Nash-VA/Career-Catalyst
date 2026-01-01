import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, Clock, AlertCircle, BookOpen, Target } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const LearningRoadmap = () => {
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

  // Generate roadmap based on skill gaps
  const generateRoadmap = () => {
    const hasSkills = career.currentSkills || [];
    const missingSkills = career.skillGap || [];
    
    const roadmap = [
      {
        title: 'Foundation Skills',
        duration: '2-3 months',
        status: hasSkills.length > 0 ? 'completed' : 'in-progress',
        skills: hasSkills.length > 0 ? hasSkills.slice(0, 3) : ['Start with basics', 'Build fundamentals'],
        description: 'Master the fundamental concepts and tools'
      },
      {
        title: 'Core Technologies',
        duration: '3-4 months',
        status: hasSkills.length >= 3 ? 'in-progress' : 'upcoming',
        skills: missingSkills.slice(0, 3),
        description: 'Learn the essential technologies for your career'
      },
      {
        title: 'Advanced Concepts',
        duration: '3-4 months',
        status: 'upcoming',
        skills: missingSkills.slice(3, 6),
        description: 'Dive deep into advanced topics and specializations'
      },
      {
        title: 'Professional Practice',
        duration: '2-3 months',
        status: 'upcoming',
        skills: ['Build Portfolio Projects', 'Contribute to Open Source', 'Network with Professionals'],
        description: 'Apply your knowledge in real-world scenarios'
      }
    ];

    return roadmap;
  };

  const roadmapSteps = generateRoadmap();

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-primary mb-2">Learning Roadmap</h1>
          <p className="text-gray-600 text-lg">
            Your personalized path to become a {career.title}
          </p>
        </div>

        {/* Career Goal Card */}
        <Card gradient className="mb-8 text-white animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                {career.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Goal: {career.title}</h2>
                <p className="text-secondary text-lg">{career.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{career.matchScore}%</div>
              <p className="text-sm opacity-90">Current Progress</p>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block"></div>

          <div className="space-y-8">
            {roadmapSteps.map((step, index) => (
              <div key={index} className="relative md:pl-20 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Timeline Icon */}
                <div className="absolute left-0 top-6 hidden md:block">
                  {step.status === 'completed' ? (
                    <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  ) : step.status === 'in-progress' ? (
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg animate-pulse">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center shadow-lg">
                      <Circle className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>

                <Card hover className={`${step.status === 'in-progress' ? 'border-2 border-blue-600 shadow-xl' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-dark">{step.title}</h3>
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          step.status === 'completed' ? 'bg-green-100 text-green-700' :
                          step.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {step.status === 'completed' ? 'COMPLETED' :
                           step.status === 'in-progress' ? 'IN PROGRESS' :
                           'UPCOMING'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={16} />
                        <span className="text-sm font-medium">Duration: {step.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-dark mb-3 flex items-center gap-2">
                      <Target size={16} />
                      Key Skills to Learn:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {step.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            step.status === 'completed' ? 'bg-green-100 text-green-700' :
                            step.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {step.status === 'in-progress' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button onClick={() => navigate('/courses')} className="w-full">
                        Find Courses for This Phase
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card hover className="bg-gradient-to-br from-blue-50 to-purple-50 cursor-pointer" onClick={() => navigate('/courses')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-dark mb-1">Browse Courses</h3>
                <p className="text-gray-600 text-sm">Find courses matching your roadmap</p>
              </div>
            </div>
          </Card>

          <Card hover className="bg-gradient-to-br from-green-50 to-teal-50 cursor-pointer" onClick={() => navigate('/interview')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-dark mb-1">Interview Prep</h3>
                <p className="text-gray-600 text-sm">Practice for {career.title} interviews</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearningRoadmap;
