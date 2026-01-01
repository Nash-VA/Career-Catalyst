import React, { useState, useEffect } from 'react';
import { Star, Clock, Award, Filter, Search } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const CourseRecommendation = () => {
  const { userData } = useUser();
  const career = userData.recommendedCareer;
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');

  // Generate courses based on career skill gaps
  const generateCourses = () => {
    if (!career) return [];

    const skillGaps = career.skillGap || [];
    const allSkills = career.requiredSkills || [];

    const coursesData = [
      ...skillGaps.map((skill, idx) => ({
        id: idx + 1,
        title: `Complete ${skill} Masterclass`,
        provider: ['Udemy', 'Coursera', 'Pluralsight', 'LinkedIn Learning'][idx % 4],
        duration: `${Math.floor(Math.random() * 40) + 20} hours`,
        level: ['Beginner', 'Intermediate'][idx % 2],
        skills: [skill],
        rating: (4.5 + Math.random() * 0.4).toFixed(1),
        price: `$${Math.floor(Math.random() * 100) + 29}.99`,
        students: `${Math.floor(Math.random() * 50) + 10}k`,
        featured: idx < 2
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
        featured: false
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
        featured: true
      }
    ];

    return coursesData;
  };

  const courses = generateCourses();

  useEffect(() => {
    if (selectedLevel === 'All') {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter(c => c.level === selectedLevel));
    }
  }, [selectedLevel]);

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-primary mb-2">Recommended Courses</h1>
          <p className="text-gray-600 text-lg">
            {career ? `Curated courses to become a ${career.title}` : 'Curated courses for your career path'}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-dark">Filter by Level:</span>
            </div>
            <div className="flex gap-2">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedLevel === level
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Featured Courses */}
        {courses.filter(c => c.featured).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Featured Courses
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {courses.filter(c => c.featured).map((course, index) => (
                <Card 
                  key={course.id}
                  hover 
                  className="border-2 border-primary animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold">
                      ⭐ FEATURED
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-dark mb-2">{course.title}</h3>
                  <p className="text-primary font-semibold mb-3">{course.provider}</p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award size={16} />
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
                      <span className="text-3xl font-bold text-primary">{course.price}</span>
                      <Button size="sm">Enroll Now</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Courses */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">All Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredCourses.length > 0 ? filteredCourses : courses)
              .filter(c => !c.featured)
              .map((course, index) => (
                <Card 
                  key={course.id}
                  hover 
                  className="flex flex-col animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
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

                  <h3 className="text-lg font-bold text-dark mb-2">{course.title}</h3>
                  <p className="text-primary font-semibold mb-3 text-sm">{course.provider}</p>

                  <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award size={14} />
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
                    {course.skills.slice(0, 2).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-secondary text-primary rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">{course.price}</span>
                      <Button size="sm">Enroll</Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRecommendation;
