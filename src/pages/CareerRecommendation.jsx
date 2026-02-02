import React, { useState, useEffect } from 'react';
import { Star, Clock, Award, Filter, Search, BookOpen, TrendingUp, ExternalLink, Users, Zap, DollarSign, X, CheckCircle, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const CourseRecommendation = () => {
  // ✅ Extract contextLoading to prevent early "Empty State" render
  const { userData, loading: contextLoading } = useUser();
  const career = userData?.recommendedCareer;
  
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [aiInsights, setAiInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const convertToINR = (price) => {
    if (typeof price === 'string' && price.includes('₹')) return price;
    if (price === 'Free' || price === 0 || price === '0') return 'Free';
    return `₹${price}`;
  };

  const generateCourseUrl = (platform, title) => {
    const searchTerm = encodeURIComponent(title);
    const platformUrls = {
      'Udemy': `https://www.udemy.com/courses/search/?q=${searchTerm}`,
      'Coursera': `https://www.coursera.org/search?query=${searchTerm}`,
      'Pluralsight': `https://www.pluralsight.com/search?q=${searchTerm}`,
      'LinkedIn Learning': `https://www.linkedin.com/learning/search?keywords=${searchTerm}`
    };
    return platformUrls[platform] || `https://www.google.com/search?q=${searchTerm}+online+course`;
  };

  useEffect(() => {
    const fetchAICourses = async () => {
      if (!career) return;
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/course-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skill_gaps: career.skillGap || [],
            career_title: career.title,
            required_skills: career.requiredSkills || []
          })
        });
        const data = await response.json();
        if (data.success && data.courses) {
          const enhanced = data.courses.map((course, idx) => ({
            ...course,
            id: idx + 1,
            price: convertToINR(course.price),
            url: course.url || generateCourseUrl(course.platform, course.title),
            skills: course.skills || [career.skillGap[0]],
            level: course.level || 'Intermediate'
          }));
          setCourses(enhanced);
          setFilteredCourses(enhanced);
        }
      } catch (error) {
        console.error('Fetch failed', error);
      } finally {
        setLoading(false);
      }
    };

    if (!contextLoading) fetchAICourses();
  }, [career, contextLoading]);

  const fetchAIInsights = async () => {
    if (!career || insightsLoading) return;
    try {
      setInsightsLoading(true);
      const response = await fetch('http://localhost:5001/api/course-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career_title: career.title,
          skill_gaps: career.skillGap || [],
          current_skills: career.currentSkills || []
        })
      });
      const data = await response.json();
      if (data.success) setAiInsights(data.insights);
    } catch (error) {
      setAiInsights('Insights currently unavailable.');
    } finally {
      setInsightsLoading(false);
    }
  };

  // ✅ 1. Wait for User Profile loading first
  if (contextLoading) {
    return <Loading message="Syncing Profile..." submessage="Preparing your dashboard" />;
  }

  // ✅ 2. Now check if career data exists after profile load is done
  if (!career) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4 opacity-30" />
          <h2 className="text-2xl font-bold text-dark mb-2">No Recommendations Yet</h2>
          <p className="text-gray-600 mb-6">Complete onboarding to unlock AI-curated courses.</p>
          <Button onClick={() => window.location.href = '/onboarding'}>Start Onboarding</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Course Recommendations</h1>
          <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-dark">AI Learning Advisor</h3>
                <p className="text-sm text-gray-600">Personalized path for {career.title}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAIInsights}
                disabled={insightsLoading}
                className="flex items-center gap-2 border-blue-200 text-blue-700 bg-white"
              >
                {/* ✅ Small Sparkles Loader for Button */}
                {insightsLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>{aiInsights ? 'Refresh' : 'Get Insights'}</span>
                  </>
                )}
              </Button>
            </div>
            {aiInsights && <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">{aiInsights}</p>}
          </Card>
        </div>

        {/* ✅ Main Custom Sparkles Loader for course fetching */}
        {loading ? (
          <div className="py-20">
            <Loading 
              message="Finding Best Courses..." 
              submessage={`AI is scanning for ${career.title} resources`} 
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} hover className="flex flex-col h-full">
                <h3 className="font-bold text-dark line-clamp-2">{course.title}</h3>
                <p className="text-primary text-sm font-semibold mb-4">{course.platform}</p>
                <div className="mt-auto pt-4 flex justify-between items-center border-t">
                  <span className="text-xl font-bold text-primary">{course.price}</span>
                  <Button size="sm" onClick={() => window.open(course.url, '_blank')}>View</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseRecommendation;