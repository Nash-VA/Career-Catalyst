import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, Clock, AlertCircle, BookOpen, Target, Loader2, Sparkles, ArrowRight, Map } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const LearningRoadmap = () => {
  const { userData } = useUser();
  const navigate = useNavigate();
  const career = userData.recommendedCareer;
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAIRoadmap = async () => {
      if (!career) return;

      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/learning-roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            career_title: career.title,
            current_skills: career.currentSkills || [],
            skill_gaps: career.skillGap || [],
            required_skills: career.requiredSkills || []
          })
        });

        const data = await response.json();
        
        if (data.success && data.roadmap) {
          setRoadmap(data.roadmap);
        } else {
          setRoadmap(generateFallbackRoadmap());
        }
      } catch (error) {
        console.error('Failed to fetch AI roadmap:', error);
        setRoadmap(generateFallbackRoadmap());
      } finally {
        setLoading(false);
      }
    };

    fetchAIRoadmap();
  }, [career]);

  const generateFallbackRoadmap = () => {
    const hasSkills = career.currentSkills || [];
    const missingSkills = career.skillGap || [];
    
    return {
      overview: `This personalized roadmap will guide you to become a successful ${career.title}. Follow each phase systematically to build your expertise.`,
      total_duration: '10-14 months',
      phases: [
        {
          phase_number: 1,
          title: 'Foundation Skills',
          duration: '2-3 months',
          status: hasSkills.length > 0 ? 'completed' : 'in-progress',
          skills: hasSkills.length > 0 ? hasSkills.slice(0, 3) : ['Start with basics', 'Build fundamentals'],
          description: 'Master the fundamental concepts and tools required for this career path.',
          learning_objectives: [
            'Understand core concepts and terminology',
            'Set up development environment',
            'Complete beginner-level projects'
          ],
          resources: ['Online tutorials', 'Documentation', 'Beginner courses']
        },
        {
          phase_number: 2,
          title: 'Core Technologies',
          duration: '3-4 months',
          status: hasSkills.length >= 3 ? 'in-progress' : 'upcoming',
          skills: missingSkills.slice(0, 3),
          description: 'Learn the essential technologies and frameworks used in the industry.',
          learning_objectives: [
            'Build intermediate-level projects',
            'Understand best practices',
            'Learn industry-standard tools'
          ],
          resources: ['Online courses', 'Project-based learning', 'Practice exercises']
        },
        {
          phase_number: 3,
          title: 'Advanced Concepts',
          duration: '3-4 months',
          status: 'upcoming',
          skills: missingSkills.slice(3, 6).length > 0 ? missingSkills.slice(3, 6) : ['Advanced patterns', 'Performance optimization'],
          description: 'Dive deep into advanced topics, patterns, and specializations.',
          learning_objectives: [
            'Master complex problem-solving',
            'Learn advanced design patterns',
            'Optimize for performance and scalability'
          ],
          resources: ['Advanced courses', 'Technical blogs', 'Research papers']
        },
        {
          phase_number: 4,
          title: 'Professional Practice',
          duration: '2-3 months',
          status: 'upcoming',
          skills: ['Portfolio Projects', 'Open Source Contributions', 'Professional Networking'],
          description: 'Apply your knowledge through real-world projects and professional engagement.',
          learning_objectives: [
            'Build a professional portfolio',
            'Contribute to real projects',
            'Network with industry professionals',
            'Prepare for job interviews'
          ],
          resources: ['GitHub', 'LinkedIn', 'Hackathons', 'Meetups']
        }
      ]
    };
  };

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

if (loading) {
  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        <Loading 
          message="Generating Your Roadmap..." 
          submessage="Creating a personalized learning path"
        />
      </div>
    </div>
  );
}

  if (!roadmap) return null;

  const hasSkills = career.currentSkills || [];
  const totalSkills = career.requiredSkills?.length || 0;
  const completionPercentage = totalSkills > 0 ? Math.round((hasSkills.length / totalSkills) * 100) : 0;

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Clean Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Map className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Learning Roadmap</h1>
          </div>
          <p className="text-gray-600 text-base pl-11">
            Your AI-powered path to become a <span className="font-semibold text-primary">{career.title}</span>
          </p>
        </div>

        {/* AI Overview - Compact */}
        {roadmap.overview && (
          <div className="bg-white rounded-lg shadow-sm border-l-4 border-l-primary p-5 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-dark mb-2">AI-Generated Roadmap</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {roadmap.overview}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <div className="bg-primary/10 px-3 py-1.5 rounded-full">
                    <span className="font-semibold text-primary">Total Duration: {roadmap.total_duration || '10-14 months'}</span>
                  </div>
                  <div className="bg-gray-100 px-3 py-1.5 rounded-full">
                    <span className="font-semibold text-gray-700">Phases: {roadmap.phases?.length || 4}</span>
                  </div>
                  <div className="bg-green-100 px-3 py-1.5 rounded-full">
                    <span className="font-semibold text-green-700">Progress: {completionPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline - Cleaner Design */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block"></div>

          <div className="space-y-6">
            {roadmap.phases?.map((phase, index) => (
              <div key={index} className="relative md:pl-16">
                {/* Timeline Icon - Smaller */}
                <div className="absolute left-0 top-4 hidden md:block">
                  {phase.status === 'completed' ? (
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center shadow-md">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  ) : phase.status === 'in-progress' ? (
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md animate-pulse">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center shadow-md">
                      <Circle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                <Card className={`${phase.status === 'in-progress' ? 'border-2 border-blue-500 shadow-md' : ''}`}>
                  {/* Header - Compact */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-gray-400">PHASE {phase.phase_number}</span>
                        <h3 className="text-xl font-bold text-dark">{phase.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          phase.status === 'completed' ? 'bg-green-100 text-green-700' :
                          phase.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {phase.status === 'completed' ? 'COMPLETED' :
                           phase.status === 'in-progress' ? 'IN PROGRESS' :
                           'UPCOMING'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{phase.description}</p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={14} />
                        <span className="text-xs font-medium">{phase.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills - Compact */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2 flex items-center gap-1.5">
                      <Target size={14} />
                      Key Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase.skills?.map((skill, idx) => (
                        <span 
                          key={idx}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                            phase.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
                            phase.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-gray-50 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Learning Objectives - Compact */}
                  {phase.learning_objectives && phase.learning_objectives.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Learning Objectives</p>
                      <ul className="space-y-1.5">
                        {phase.learning_objectives.map((objective, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle size={14} className="text-primary mt-0.5 flex-shrink-0" />
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Resources - Compact */}
                  {phase.resources && phase.resources.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Recommended Resources</p>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.resources.map((resource, idx) => (
                          <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button for In-Progress Phase */}
                  {phase.status === 'in-progress' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button 
                        onClick={() => navigate('/courses')} 
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <BookOpen size={16} />
                        Find Courses for This Phase
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Action Cards - Cleaner */}
        <div className="grid md:grid-cols-2 gap-5 mt-8">
          <div 
            onClick={() => navigate('/courses')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-all">
                <BookOpen className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-primary mb-1 group-hover:text-primary-dark">
                  Browse Courses
                </h3>
                <p className="text-sm text-gray-600">Find courses matching your roadmap</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/interview')}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-all">
                <Target className="w-6 h-6 text-primary group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-primary mb-1 group-hover:text-primary-dark">
                  Interview Prep
                </h3>
                <p className="text-sm text-gray-600">Practice for {career.title} interviews</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningRoadmap;
