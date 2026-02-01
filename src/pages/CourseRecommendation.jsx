import React, { useState, useEffect } from 'react';
import { Star, Clock, Award, Filter, Search, BookOpen, TrendingUp, ExternalLink, Users, RefreshCw, Zap, DollarSign, X, CheckCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';


const CourseRecommendation = () => {
  const { userData } = useUser();
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


  // ✅ Handle prices properly
  const convertToINR = (price) => {
    if (typeof price === 'string' && price.includes('₹')) return price;
    if (price === 'Free' || price === 0 || price === '0') return 'Free';
    if (typeof price === 'string' && price.includes('$')) return '₹455';
    if (typeof price === 'number') return `₹${price}`;
    return '₹455';
  };


  // Generate course URL
  const generateCourseUrl = (platform, title) => {
    const searchTerm = encodeURIComponent(title);
    const platformUrls = {
      'Udemy': `https://www.udemy.com/courses/search/?q=${searchTerm}`,
      'Coursera': `https://www.coursera.org/search?query=${searchTerm}`,
      'Pluralsight': `https://www.pluralsight.com/search?q=${searchTerm}`,
      'LinkedIn Learning': `https://www.linkedin.com/learning/search?keywords=${searchTerm}`,
      'edX': `https://www.edx.org/search?q=${searchTerm}`,
      'Udacity': `https://www.udacity.com/courses/all?search=${searchTerm}`,
      'freeCodeCamp': `https://www.freecodecamp.org/learn`,
      'Codecademy': `https://www.codecademy.com/search?query=${searchTerm}`,
      'Career Catalyst': '#'
    };
    return platformUrls[platform] || `https://www.google.com/search?q=${searchTerm}+online+course`;
  };


  // Fetch AI-generated courses
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
          const enhancedCourses = data.courses.map((course, idx) => {
            const isFree = course.price === 'Free' || course.price === '$0' || course.price === '₹0' || course.price === 0;
            
            let priceValue = 0;
            if (!isFree) {
              const priceStr = String(course.price).replace('$', '').replace('₹', '').replace(',', '');
              const numPrice = parseFloat(priceStr);
              priceValue = course.price.includes('₹') ? numPrice / 83 : numPrice;
            }
            
            return {
              id: idx + 1,
              title: course.title,
              provider: course.platform,
              duration: course.duration,
              level: course.level || 'Intermediate',
              skills: course.skills || [career.skillGap[idx % career.skillGap.length]],
              rating: course.rating || (4.5 + Math.random() * 0.4).toFixed(1),
              price: convertToINR(course.price),
              priceValue: priceValue,
              students: course.students || `${Math.floor(Math.random() * 50) + 10}k`,
              featured: idx < 2,
              description: course.description || `Master ${course.title} with hands-on projects`,
              url: course.url || generateCourseUrl(course.platform, course.title),
              reviewCount: Math.floor(Math.random() * 5000) + 1000
            };
          });

          console.log('✅ Courses loaded with URLs:', enhancedCourses.map(c => ({ title: c.title, url: c.url })));
          setCourses(enhancedCourses);
          setFilteredCourses(enhancedCourses);
        } else {
          const fallbackCourses = generateFallbackCourses();
          setCourses(fallbackCourses);
          setFilteredCourses(fallbackCourses);
        }
      } catch (error) {
        console.error('Failed to fetch AI courses:', error);
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

    const getRealisticPrice = (platform) => {
      const prices = {
        'Udemy': ['₹455', '₹499', '₹3,099', 'Free'],
        'Coursera': ['₹4,500', '₹6,000', '₹7,500'],
        'Pluralsight': ['₹2,999', '₹3,499'],
        'LinkedIn Learning': ['₹1,650', '₹1,950'],
        'edX': ['Free', '₹5,000', '₹8,000'],
        'Udacity': ['₹6,999', '₹9,999'],
        'Codecademy': ['Free', '₹2,499'],
        'freeCodeCamp': ['Free']
      };
      const platformPrices = prices[platform] || ['₹455', '₹499', 'Free'];
      return platformPrices[Math.floor(Math.random() * platformPrices.length)];
    };

    const platforms = [
      { name: 'Udemy', baseUrl: 'https://www.udemy.com/courses/search/?q=' },
      { name: 'Coursera', baseUrl: 'https://www.coursera.org/search?query=' },
      { name: 'Pluralsight', baseUrl: 'https://www.pluralsight.com/search?q=' },
      { name: 'LinkedIn Learning', baseUrl: 'https://www.linkedin.com/learning/search?keywords=' }
    ];

    return [
      ...skillGaps.map((skill, idx) => {
        const platform = platforms[idx % platforms.length];
        const price = getRealisticPrice(platform.name);
        const isFree = price === 'Free';
        
        let priceValue = 0;
        if (!isFree) {
          const numPrice = parseInt(price.replace('₹', '').replace(',', ''));
          priceValue = numPrice / 83;
        }
        
        return {
          id: idx + 1,
          title: `Complete ${skill} Masterclass 2026`,
          provider: platform.name,
          duration: `${Math.floor(Math.random() * 40) + 20} hours`,
          level: ['Beginner', 'Intermediate'][idx % 2],
          skills: [skill],
          rating: (4.5 + Math.random() * 0.4).toFixed(1),
          price: price,
          priceValue: priceValue,
          students: `${Math.floor(Math.random() * 50) + 10}k`,
          featured: idx < 2,
          description: `Learn ${skill} from basics to advanced with real-world projects`,
          url: platform.baseUrl + encodeURIComponent(skill),
          reviewCount: Math.floor(Math.random() * 5000) + 1000
        };
      }),
      ...allSkills.slice(0, 3).map((skill, idx) => {
        const platforms2 = [
          { name: 'edX', url: `https://www.edx.org/search?q=${encodeURIComponent(skill)}` },
          { name: 'Udacity', url: `https://www.udacity.com/courses/all?search=${encodeURIComponent(skill)}` },
          { name: 'Codecademy', url: `https://www.codecademy.com/search?query=${encodeURIComponent(skill)}` },
          { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn' }
        ];
        const selectedPlatform = platforms2[idx % 4];
        const price = getRealisticPrice(selectedPlatform.name);
        const isFree = price === 'Free';
        
        let priceValue = 0;
        if (!isFree) {
          const numPrice = parseInt(price.replace('₹', '').replace(',', ''));
          priceValue = numPrice / 83;
        }
        
        return {
          id: skillGaps.length + idx + 1,
          title: `${skill} for Professionals`,
          provider: selectedPlatform.name,
          duration: `${Math.floor(Math.random() * 30) + 15} hours`,
          level: 'Intermediate',
          skills: [skill],
          rating: (4.3 + Math.random() * 0.5).toFixed(1),
          price: price,
          priceValue: priceValue,
          students: `${Math.floor(Math.random() * 40) + 15}k`,
          featured: false,
          description: `Advanced ${skill} techniques for professional developers`,
          url: selectedPlatform.url,
          reviewCount: Math.floor(Math.random() * 3000) + 500
        };
      }),
      {
        id: 100,
        title: `${career.title} - Complete Career Path`,
        provider: 'Career Catalyst',
        duration: '6 months',
        level: 'All Levels',
        skills: allSkills.slice(0, 4),
        rating: '4.9',
        price: '₹16,599',
        priceValue: 199.99,
        students: '75k',
        featured: true,
        description: `Comprehensive program to master ${career.title} with mentorship and projects`,
        url: '#',
        reviewCount: 12500
      }
    ];
  };


  // Fetch AI insights
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
      if (data.success && data.insights) {
        setAiInsights(data.insights);
      }
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
      setAiInsights('Unable to generate insights at this time. Please try again later.');
    } finally {
      setInsightsLoading(false);
    }
  };


  // Filter courses
  useEffect(() => {
    let filtered = courses;

    if (selectedLevel !== 'All') {
      filtered = filtered.filter(c => c.level === selectedLevel);
    }

    if (selectedPrice !== 'All') {
      if (selectedPrice === 'Free') {
        filtered = filtered.filter(c => c.price === 'Free' || c.priceValue === 0);
      } else if (selectedPrice === 'Under ₹4,000') {
        filtered = filtered.filter(c => c.priceValue > 0 && c.priceValue < 50);
      } else if (selectedPrice === '₹4,000-₹8,000') {
        filtered = filtered.filter(c => c.priceValue >= 50 && c.priceValue <= 100);
      } else if (selectedPrice === 'Over ₹8,000') {
        filtered = filtered.filter(c => c.priceValue > 100);
      }
    }

    if (selectedSkill !== 'All') {
      filtered = filtered.filter(c => 
        c.skills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()))
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredCourses(filtered);
  }, [selectedLevel, selectedPrice, selectedSkill, searchQuery, courses]);


  const uniqueSkills = ['All', ...new Set(courses.flatMap(c => c.skills))];


  // ✅ FIXED: Open course in new tab with better error handling
  const openCourse = (url, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    console.log('🔗 Opening course:', url);
    
    if (!url || url === '#') {
      console.warn('⚠️ Invalid URL');
      return;
    }
    
    try {
      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      if (!opened || opened.closed || typeof opened.closed === 'undefined') {
        console.error('❌ Popup blocked');
        console.log('Please allow popups to view courses');
      } else {
        console.log('✅ Course opened successfully');
      }
    } catch (error) {
      console.error('Error opening course:', error);
    }
  };


  const clearFilters = () => {
    setSelectedLevel('All');
    setSelectedPrice('All');
    setSelectedSkill('All');
    setSearchQuery('');
  };


  const activeFiltersCount = [selectedLevel, selectedPrice, selectedSkill].filter(f => f !== 'All').length;
  const freeCoursesCount = courses.filter(c => c.price === 'Free').length;


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
          <div className="flex items-start justify-between flex-wrap gap-6 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">Course Recommendations</h1>
              <p className="text-gray-600 text-lg">
                AI-curated learning paths to become a <span className="font-semibold text-primary">{career.title}</span>
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex gap-4 flex-wrap">
              <div className="bg-white rounded-lg px-5 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <BookOpen size={16} />
                  <span>Total Courses</span>
                </div>
                <p className="text-2xl font-bold text-primary">{courses.length}</p>
              </div>
              <div className="bg-white rounded-lg px-5 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <CheckCircle size={16} />
                  <span>Free Courses</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{freeCoursesCount}</p>
              </div>
              <div className="bg-white rounded-lg px-5 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <TrendingUp size={16} />
                  <span>Skills to Learn</span>
                </div>
                <p className="text-2xl font-bold text-primary">{career.skillGap?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* AI Insights Section */}
          <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-dark mb-1">AI Learning Advisor</h3>
                  <p className="text-sm text-gray-600">Get personalized insights on your learning path</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAIInsights}
                disabled={insightsLoading}
                className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-100 bg-white"
              >
                {insightsLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
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

            {aiInsights && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-200 mt-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {aiInsights}
                </p>
              </div>
            )}
          </Card>
        </div>


        {/* Search and Filters */}
        <Card className="mb-8 animate-slide-up">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses by title, skill, or platform..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-bold text-dark">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-primary text-white rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-primary flex items-center gap-1 font-medium"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden text-sm text-primary font-bold"
              >
                {showFilters ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className={`space-y-5 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div>
              <span className="font-bold text-dark mb-3 block">Difficulty Level</span>
              <div className="flex flex-wrap gap-2">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
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

            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <span className="font-bold text-dark">Price Range</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', 'Free', 'Under ₹4,000', '₹4,000-₹8,000', 'Over ₹8,000'].map((price) => (
                  <button
                    key={price}
                    onClick={() => setSelectedPrice(price)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedPrice === price
                        ? price === 'Free'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-dark mb-3 block">Filter by Skill</span>
              <div className="flex flex-wrap gap-2">
                {uniqueSkills.slice(0, 10).map((skill) => (
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
            <RefreshCw className="w-12 h-12 text-primary animate-spin mb-4" />
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
                    <div
                      key={course.id}
                      onClick={(e) => openCourse(course.url, e)}
                      className="cursor-pointer"
                    >
                      <Card 
                        hover 
                        className="border-2 border-primary animate-slide-up relative overflow-hidden"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
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
                              course.level === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {course.level}
                            </span>
                            {course.url !== '#' && (
                              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                            )}
                          </div>

                          <h3 className="text-xl font-bold text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                          <p className="text-primary font-semibold mb-2">{course.provider}</p>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users size={16} />
                              <span>{course.students}</span>
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
                            <span className="text-xs text-gray-500">({course.reviewCount} reviews)</span>
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
                                <span className={`text-3xl font-bold ${course.price === 'Free' ? 'text-green-600' : 'text-primary'}`}>
                                  {course.price}
                                </span>
                                {course.price !== 'Free' && (
                                  <p className="text-xs text-gray-500 mt-1">One-time payment</p>
                                )}
                              </div>
                              <Button 
                                size="sm" 
                                className="flex items-center gap-2"
                                onClick={(e) => openCourse(course.url, e)}
                              >
                                View Course
                                <ExternalLink size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
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
                  <p className="text-gray-600 text-lg font-semibold mb-2">No courses match your filters</p>
                  <p className="text-gray-500 text-sm mb-6">Try adjusting your search or filters</p>
                  {activeFiltersCount > 0 && (
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  )}
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses
                    .filter(c => !c.featured)
                    .map((course, index) => (
                      <div
                        key={course.id}
                        onClick={(e) => openCourse(course.url, e)}
                        className="cursor-pointer"
                      >
                        <Card 
                          hover 
                          className="flex flex-col animate-slide-up group h-full"
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
                            {course.url !== '#' && (
                              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                            )}
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
                              <Users size={14} />
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
                              <span className={`text-2xl font-bold ${course.price === 'Free' ? 'text-green-600' : 'text-primary'}`}>
                                {course.price}
                              </span>
                              <Button 
                                size="sm" 
                                className="group-hover:scale-105 transition-transform"
                                onClick={(e) => openCourse(course.url, e)}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
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
