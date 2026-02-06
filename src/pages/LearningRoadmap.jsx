import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, Clock, AlertCircle, BookOpen, Target, Loader2, Sparkles, ArrowRight, Map, Check } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const LearningRoadmap = () => {
  const { userData, completeSkill } = useUser();
  const navigate = useNavigate();
  const career = userData?.recommendedCareer;
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAIRoadmap = async () => {
      if (!career) return;

      try {
        setLoading(true);

        const cacheKey = `roadmap_${career.title}_${JSON.stringify(career.currentSkills || [])}`;
        const cached = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}_time`);
        
        const now = Date.now();
        const CACHE_DURATION = 15 * 60 * 1000; 

        if (cached && cacheTime && (now - parseInt(cacheTime)) < CACHE_DURATION) {
          console.log('✅ Using cached roadmap');
          setRoadmap(JSON.parse(cached));
          setLoading(false);
          return;
        }

        console.log('🔄 Fetching fresh roadmap from AI...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); 

        const response = await fetch('http://localhost:5001/api/learning-roadmap', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify({
            career_title: career.title,
            current_skills: (career.currentSkills || []).slice(0, 5), 
            skill_gaps: (career.skillGap || []).slice(0, 6),
            required_skills: (career.requiredSkills || []).slice(0, 6)
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = await response.json();
        
        if (data.success && data.roadmap) {
          console.log('✅ AI roadmap received');
          localStorage.setItem(cacheKey, JSON.stringify(data.roadmap));
          localStorage.setItem(`${cacheKey}_time`, now.toString());
          setRoadmap(data.roadmap);
        } else {
          console.warn('⚠️ AI failed, using fallback');
          setRoadmap(generateFallbackRoadmap());
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('❌ Request timeout - using fallback');
        } else {
          console.error('❌ Failed to fetch AI roadmap:', error);
        }
        setRoadmap(generateFallbackRoadmap());
      } finally {
        setLoading(false);
      }
    };

    fetchAIRoadmap();
  }, [career]);

  // Helper to check if a specific skill is already in currentSkills
  const isSkillAcquired = (skillName) => {
    if (!skillName || typeof skillName !== 'string') return false;
    if (!career?.currentSkills || !Array.isArray(career.currentSkills)) return false;
    
    return career.currentSkills.some(s => 
        s && typeof s === 'string' && s.toLowerCase() === skillName.toLowerCase()
    );
  };

  const handleToggleSkill = async (skillName) => {
    if (!skillName || isSkillAcquired(skillName)) return; 
    
    try {
      await completeSkill(skillName);
      // Context update triggers re-render automatically
    } catch (err) {
      console.error("Error updating skill:", err);
    }
  };

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
          skills: hasSkills.length > 0 ? hasSkills.slice(0, 3) : ['HTML', 'CSS', 'JavaScript'],
          description: 'In these first few months, you\'ll get comfortable with the basic tools used every day.',
          learning_objectives: ['Understand core concepts', 'Set up development environment'],
          resources: ['Online tutorials', 'Documentation']
        },
        {
          phase_number: 2,
          title: 'Core Technologies',
          duration: '3-4 months',
          skills: missingSkills.slice(0, 3),
          description: 'Dive into the main frameworks and tools.',
          learning_objectives: ['Build intermediate-level projects', 'Understand best practices'],
          resources: ['Online courses', 'Project-based learning']
        },
        // ... additional phases ...
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

  // --- 🟢 UPDATED PROGRESS LOGIC ---
  // 1. Get all unique skills from the roadmap phases
  const allRoadmapSkills = roadmap.phases?.flatMap(phase => phase.skills || []) || [];
  const uniqueRoadmapSkills = [...new Set(allRoadmapSkills)];

  // 2. Count how many of THESE specific skills are acquired
  const completedRoadmapSkillsCount = uniqueRoadmapSkills.filter(skill => isSkillAcquired(skill)).length;
  const totalRoadmapSkillsCount = uniqueRoadmapSkills.length;

  // 3. Calculate Percentage based strictly on roadmap skills
  const completionPercentage = totalRoadmapSkillsCount > 0 
    ? Math.round((completedRoadmapSkillsCount / totalRoadmapSkillsCount) * 100) 
    : 0;
  // --- END UPDATED LOGIC ---

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Map className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Learning Roadmap</h1>
          </div>
          <p className="text-gray-600 text-base pl-11">
            Your AI-powered path to become a <span className="font-semibold text-primary">{career.title}</span>
          </p>
        </div>

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
                  <div className={`px-3 py-1.5 rounded-full transition-colors duration-500 ${
                    completionPercentage === 100 ? 'bg-green-100 text-green-700' : 'bg-green-50 text-green-600'
                  }`}>
                    <span className="font-semibold">Progress: {completionPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block"></div>

          <div className="space-y-6">
            {roadmap.phases?.map((phase, index) => {
                // --- 🟢 NEW PHASE STATUS LOGIC ---
                const phaseSkills = phase.skills || [];
                const phaseTotal = phaseSkills.length;
                const phaseCompleted = phaseSkills.filter(s => isSkillAcquired(s)).length;

                let phaseStatus = 'UPCOMING';
                if (phaseTotal > 0 && phaseCompleted === phaseTotal) {
                    phaseStatus = 'COMPLETED';
                } else if (phaseCompleted > 0) {
                    phaseStatus = 'IN PROGRESS';
                }
                
                const isPhaseComplete = phaseStatus === 'COMPLETED';
                const isInProgress = phaseStatus === 'IN PROGRESS';
                // --- END LOGIC ---

                return (
              <div key={index} className="relative md:pl-16">
                <div className="absolute left-0 top-4 hidden md:block">
                  {isPhaseComplete ? (
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center shadow-md transition-all duration-300 transform scale-105">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  ) : isInProgress ? (
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md animate-pulse">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center shadow-md">
                      <Circle className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                <Card className={`${isInProgress ? 'border-2 border-blue-500 shadow-md' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-gray-400">PHASE {phase.phase_number}</span>
                        <h3 className="text-xl font-bold text-dark">{phase.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${
                          isPhaseComplete ? 'bg-green-100 text-green-700' :
                          isInProgress ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {phaseStatus}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{phase.description}</p>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={14} />
                        <span className="text-xs font-medium">{phase.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2 flex items-center gap-1.5">
                      <Target size={14} />
                      Key Skills (Click to complete)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase.skills?.map((skill, idx) => {
                        if (!skill || typeof skill !== 'string') return null;
                        
                        const acquired = isSkillAcquired(skill);
                        return (
                          <button 
                            key={idx}
                            onClick={() => handleToggleSkill(skill)}
                            disabled={acquired}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
                              acquired 
                                ? 'bg-green-50 text-green-700 border border-green-200 cursor-default shadow-sm' 
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary cursor-pointer active:scale-95'
                            }`}
                          >
                            {acquired ? <CheckCircle size={14} /> : <Circle size={14} />}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

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

                  {isInProgress && !isPhaseComplete && (
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
            )})}
          </div>
        </div>

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