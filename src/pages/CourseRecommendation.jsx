import React, { useState, useEffect } from 'react';
import { Star, Clock, Award, Filter, Search, BookOpen, TrendingUp, Loader2, ExternalLink } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const CourseRecommendation = () => {
  const { userData } = useUser();
  const career = userData.recommendedCareer;
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');

  // Fetch AI-generated courses from ML service
  useEffect(() => {
    const fetchAICourses = async () => {
      if (!career) {
        setLoading(false);
        return;
      }

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
          // Enhance AI courses with additional data
          const enhancedCourses = data.courses.map((course, idx) => ({
            id: idx + 1,
            title: course.title,
            provider: course.platform,
            duration: course.duration,
            level: course.level || 'Intermediate',
            skills: course.skills || [career.skillGap[idx % career.skillGap.length]],
            rating: course.rating || (4.5 + Math.random() * 0.4).toFixed(1),
            price: course.price || `$${Math.floor(Math.random() * 100) + 29}.99`,
            students: `${Math.floor(Math.random() * 50) + 10}k`,
            featured: idx < 2,
            description: course.description || `Master ${course.title} with hands-on projects`,
            url: course.url || '#'
          }));

          setCourses(enhancedCourses);
          setFilteredCourses(enhancedCourses);
        } else {
          // Fallback to generated courses if AI fails
          const fallbackCourses = generateFallbackCourses();
          setCourses(fallbackCourses);
          setFilteredCourses(fallbackCourses);
        }
      } catch (error) {
        console.error('Failed to fetch AI courses:', error);
        // Use fallback courses
        const fallbackCourses = generateFallbackCourses();
        setCourses(fallbackCourses);
        setFilteredCourses(fallbackCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchAICourses();
  }, [career]);

  // Fallback course generation
  const generateFallbackCourses = () => {
    if (!career) return [];

    const skillGaps = career.skillGap || [];
    const allSkills = career.requiredSkills || [];

    return [
      ...skillGaps.map((skill, idx) => ({
        id: idx + 1,
        title: `Complete ${skill} Masterclass 2026`,
        provider: ['Udemy', 'Coursera', 'Pluralsight', 'LinkedIn Learning'][idx % 4],
        duration: `${Math.floor(Math.random() * 40) + 20} hours`,
        level: ['Beginner', 'Intermediate'][idx % 2],
        skills: [skill],
        rating: (4.5 + Math.random() * 0.4).toFixed(1),
        price: `$${Math.floor(Math.random() * 100) + 29}.99`,
        students: `${Math.floor(Math.random() * 50) + 10}k`,
        featured: idx < 2,
        description: `Learn ${skill} from basics to advanced with real-world projects`,
        url: '#'
      })),
      ...allSkills.slice(0, 3).map((skill, idx) => ({
        id: skillGaps.length + idx + 1,
        title: `${skill} for Professionals`,
        provider: ['edX', 'Udacity', 'Codecademy', 'FreeCodeCamp'][idx % 4],
        duration: `${Math.floor(Math.random() * 30) + 15} hours`,
        level: 'Intermediate',
        skills: [skill],
        rating: (4.3 + Math.random() * 0.5).toFixed(1),
        price: `$${Math.floor(Math.random() * 80) + 39}.99`,
        students: `${Math.floor(Math.random() * 40) + 15}k`,
        featured: false,
        description: `Advanced ${skill} techniques for professional developers`,
        url: '#'
      })),
      {
        id: 100,
        title: `${career.title} - Complete Career Path`,
        provider: 'Career Catalyst',
        duration: '6 months',
        level: 'All Levels',
        skills: allSkills.slice(0, 4),
        rating: '4.9',
        price: '$199.99',
        students: '75k',
        featured: true,
        description: `Comprehensive program to master ${career.title} with mentorship and projects`,
        url: '#'
      }
    ];
  };

  // Filter courses based on level, skill, and search
  useEffect(() => {
    let filtered = courses;

    // Filter by level
    if (selectedLevel !== 'All') {
      filtered = filtered.filter(c => c.level === selectedLevel);
    }

    // Filter by skill
    if (selectedSkill !== 'All') {
      filtered = filtered.filter(c => 
        c.skills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()))
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredCourses(filtered);
  }, [selectedLevel, selectedSkill, searchQuery, courses]);

  // Get unique skills for filter
  const uniqueSkills = ['All', ...new Set(courses.flatMap(c => c.skills))];

  if (!career) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">No Career Recommendation Yet</h2>
          <p className="text-gray-600 mb-6">
            Please complete your onboarding to get personalized course recommendations
          </p>
          <Button onClick={() => window.location.href = '/onboarding'}>
            Complete Onboarding
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Stats */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">Recommended Courses</h1>
              <p className="text-gray-600 text-lg">
                AI-curated learning paths to become a <span className="font-semibold text-primary">{career.title}</span>
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <BookOpen size={16} />
                  <span>Total Courses</span>
                </div>
                <p className="text-2xl font-bold text-primary">{courses.length}</p>
              </div>
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <TrendingUp size={16} />
                  <span>Skill Gaps</span>
                </div>
                <p className="text-2xl font-bold text-primary">{career.skillGap?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 animate-slide-up">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses by title, skill, or platform..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Level Filter */}
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-dark">Level:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                      selectedLevel === level
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Filter */}
            <div className="flex items-center flex-wrap gap-4">
              <span className="font-semibold text-dark">Filter by Skill:</span>
              <div className="flex flex-wrap gap-2">
                {uniqueSkills.slice(0, 8).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setSelectedSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedSkill === skill
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
        

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Loading AI-powered course recommendations...</p>
          </div>
        ) : (
          <>
            {/* Featured Courses */}
            {filteredCourses.filter(c => c.featured).length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Featured Courses
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredCourses.filter(c => c.featured).map((course, index) => (
                    <Card 
                      key={course.id}
                      hover 
                      className="border-2 border-primary animate-slide-up relative overflow-hidden"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Featured Badge */}
                      <div className="absolute top-0 right-0 bg-gradient-to-br from-primary to-primary-dark text-white px-4 py-2 rounded-bl-lg shadow-lg">
                        <div className="flex items-center gap-1">
                          <Award size={14} />
                          <span className="text-xs font-bold">FEATURED</span>
                        </div>
                      </div>

                      <div className="pt-8">
                        <div className="flex items-start justify-between mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                            course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {course.level}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-dark mb-2 line-clamp-2">{course.title}</h3>
                        <p className="text-primary font-semibold mb-2">{course.provider}</p>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen size={16} />
                            <span>{course.students} students</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={16} 
                                className={i < Math.floor(course.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'} 
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
                          <span className="text-xs text-gray-500">({course.students} reviews)</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-secondary text-primary rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-3xl font-bold text-primary">{course.price}</span>
                              <p className="text-xs text-gray-500 mt-1">One-time payment</p>
                            </div>
                            <Button size="sm" className="flex items-center gap-2">
                              Enroll Now
                              <ExternalLink size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Courses */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center justify-between">
                <span>All Courses</span>
                <span className="text-sm font-normal text-gray-600">
                  {filteredCourses.filter(c => !c.featured).length} courses available
                </span>
              </h2>

              {filteredCourses.filter(c => !c.featured).length === 0 ? (
                <Card className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No courses match your filters</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses
                    .filter(c => !c.featured)
                    .map((course, index) => (
                      <Card 
                        key={course.id}
                        hover 
                        className="flex flex-col animate-slide-up group"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                            course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {course.level}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-primary font-semibold mb-2 text-sm">{course.provider}</p>
                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{course.description}</p>

                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen size={14} />
                            <span>{course.students}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={i < Math.floor(course.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'} 
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-gray-700">{course.rating}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {course.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-secondary text-primary rounded text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                          {course.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{course.skills.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-primary">{course.price}</span>
                            <Button size="sm" className="group-hover:scale-105 transition-transform">
                              Enroll
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseRecommendation;
