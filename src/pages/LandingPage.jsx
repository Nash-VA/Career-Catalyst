import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Target, TrendingUp, Award, BookOpen, Users, ArrowRight, 
  Play, Zap, Brain, BarChart3, ChevronDown, Star, Rocket
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});
  const heroRef = useRef(null);
  const observerRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.dataset.section]: true }));
        }
      });
    }, observerOptions);

    observerRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI Career Matching',
      description: 'Machine learning analyzes your profile to recommend careers perfectly aligned with your skills and aspirations.',
      gradient: 'from-primary via-accent to-dark',
      stat: '98% accuracy'
    },
    {
      icon: BarChart3,
      title: 'Skill Gap Analysis',
      description: 'Precision mapping identifies exactly what skills you need to develop to reach your target role.',
      gradient: 'from-accent via-primary to-dark',
      stat: '50+ skills'
    },
    {
      icon: Target,
      title: 'Personalized Roadmap',
      description: 'Step-by-step learning paths with milestones, curated resources, and progress tracking.',
      gradient: 'from-dark via-primary to-accent',
      stat: ' plan'
    },
    {
      icon: Award,
      title: 'Resume Optimizer',
      description: 'AI-powered analysis enhances your resume to match industry standards and highlight your strengths.',
      gradient: 'from-primary via-dark to-accent',
      stat: '5x callbacks'
    },
    {
      icon: BookOpen,
      title: 'Course Curation',
      description: 'Access thousands of courses filtered specifically for your skill gaps and learning style.',
      gradient: 'from-accent via-dark to-primary',
      stat: '10K+ courses'
    },
    {
      icon: Users,
      title: 'Interview Preparation',
      description: 'Practice with role-specific questions, get AI feedback, and track your improvement.',
      gradient: 'from-dark via-accent to-primary',
      stat: '500+ questions'
    }
  ];

  const steps = [
    { 
      number: '01', 
      icon: '📄',
      title: 'Upload Resume', 
      description: 'Quick profile creation with AI-powered resume parsing in seconds.',
      color: 'from-primary to-accent'
    },
    { 
      number: '02', 
      icon: '🤖',
      title: 'AI Analysis', 
      description: 'Our ML models evaluate your profile to find your perfect career match.',
      color: 'from-accent to-secondary'
    },
    { 
      number: '03', 
      icon: '🗺️',
      title: 'Get Roadmap', 
      description: 'Receive personalized learning plan with timelines and resources.',
      color: 'from-secondary to-primary'
    },
    { 
      number: '04', 
      icon: '🚀',
      title: 'Take Action', 
      description: 'Start learning, track progress, and land interviews faster.',
      color: 'from-primary to-dark'
    }
  ];

  const stats = [
    // { value: '10K+', label: 'Active Users', icon: Users },
    // { value: '95%', label: 'Success Rate', icon: Target },
    // { value: '500+', label: 'Career Paths', icon: Rocket },
    // { value: '4.9/5', label: 'User Rating', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-light overflow-hidden">
      <Navbar transparent />
      
      {/* Enhanced Dynamic Background with Mouse Parallax */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-accent rounded-full blur-3xl opacity-20 transition-transform duration-1000 ease-out"
          style={{ 
            transform: `translate(${scrollY * 0.15}px, ${scrollY * 0.1}px) translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)` 
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-secondary rounded-full blur-3xl opacity-20 transition-transform duration-1000 ease-out"
          style={{ 
            transform: `translate(${-scrollY * 0.1}px, ${-scrollY * 0.15}px) translate(${-mousePosition.x * 0.03}px, ${-mousePosition.y * 0.03}px)` 
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-3xl opacity-10 transition-transform duration-1000 ease-out"
          style={{ 
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` 
          }}
        />
      </div>

      {/* Hero Section with Enhanced Animations */}
      <section className="relative min-h-screen flex items-center px-4 pt-24 pb-32">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left: Content */}
            <div className="space-y-10 relative z-10">
              <div 
                className="inline-flex items-center gap-3 px-5 py-3 bg-accent/10 backdrop-blur-sm rounded-full shadow-lg animate-fade-in border border-accent/20 hover:border-accent/40 hover:bg-accent/15 transition-all duration-500 cursor-default group"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent group-hover:scale-125 transition-transform duration-300"></span>
                </div>
                <span className="text-sm font-semibold text-primary group-hover:text-dark transition-colors duration-300">
                  AI-Powered Career Platform
                </span>
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              </div>

              <div className="space-y-8">
                <h1 
                  className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] animate-slide-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="text-primary inline-block hover:scale-105 transition-transform duration-300">Navigate Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-gradient-x inline-block hover:scale-105 transition-transform duration-300">
                    Dream Career
                  </span>
                  <br />
                  <span className="text-dark inline-block hover:scale-105 transition-transform duration-300">With AI</span>
                </h1>
                
                <p 
                  className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl animate-slide-up hover:text-gray-700 transition-colors duration-300"
                  style={{ animationDelay: '0.3s' }}
                >
                  Get personalized career recommendations, bridge skill gaps, and accelerate your professional growth with <span className="font-semibold text-primary">AI-driven insights</span>.
                </p>
              </div>

              <div 
                className="flex flex-col sm:flex-row gap-4 animate-slide-up"
                style={{ animationDelay: '0.4s' }}
              >
                <Link to="/signup" className="group">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto px-8 py-5 text-lg font-bold bg-primary hover:bg-accent text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden"
                  >
                    <span className="absolute inset-0 w-0 bg-white opacity-10 transition-all duration-500 ease-out group-hover:w-full"></span>
                    <Sparkles className="inline w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="relative">Get Started Free</span>
                    <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300 relative" />
                  </Button>
                </Link>
                {/* <Link to="/login">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-8 py-5 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-500 group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-out group-hover:w-full"></span>
                    <Play className="inline mr-2 w-5 h-5 group-hover:scale-125 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10">Watch Demo</span>
                  </Button>
                </Link> */}
              </div>

              {/* Stats Row */}
              <div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 animate-slide-up"
                style={{ animationDelay: '0.5s' }}
              >
                {stats.map((stat, idx) => (
                  <div 
                    key={idx} 
                    className="text-center group cursor-default hover:scale-110 transition-transform duration-300"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-5 h-5 text-accent mr-1 group-hover:rotate-12 transition-transform duration-300" />
                      <p className="text-2xl md:text-3xl font-bold text-primary group-hover:text-accent transition-colors duration-300">{stat.value}</p>
                    </div>
                    <p className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Enhanced Visual Element with Stagger Animation */}
            <div 
              className="relative hidden lg:block animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="relative w-full h-[700px]">
                {/* Floating Dashboard Card */}
                <div 
                  className="absolute top-0 right-0 w-[480px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-[0_25px_70px_rgba(39,66,69,0.35)] transition-all duration-700 hover:scale-105 cursor-pointer"
                  style={{ 
                    animation: 'float 6s ease-in-out infinite',
                    animationDelay: '0s',
                    transform: `translateY(${scrollY * 0.05}px)`
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                        Career Match Score
                        <Sparkles className="w-3 h-3 text-accent animate-pulse" />
                      </p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">98%</p>
                    </div>
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group hover:rotate-12 hover:scale-110 transition-all duration-500">
                      <Target className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between hover:translate-x-1 transition-transform duration-300">
                      <span className="text-gray-700 font-medium">Senior Software Engineer</span>
                      <span className="px-3 py-1 text-green-600 font-semibold text-xs bg-green-50 rounded-full">
                        Perfect Fit
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-1000 animate-gradient-x"
                        style={{ width: '98%' }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-4">
                      {['React', 'Node.js', 'TypeScript'].map((skill, idx) => (
                        <div 
                          key={idx} 
                          className="px-3 py-2 bg-accent/10 rounded-lg text-center hover:bg-accent/20 hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <p className="text-xs font-semibold text-primary group-hover:text-accent transition-colors duration-300">{skill}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills Card */}
                <div 
                  className="absolute top-48 left-0 w-[360px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-gray-100 hover:shadow-[0_25px_70px_rgba(39,66,69,0.35)] transition-all duration-700 hover:scale-105 cursor-pointer"
                  style={{ 
                    animation: 'float 7s ease-in-out infinite',
                    animationDelay: '1s',
                    transform: `translateY(${scrollY * 0.08}px)`
                  }}
                >
                  <div className="flex items-center gap-3 mb-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-md">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Skills to Master</p>
                      <p className="text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300">3 Core</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'React.js', progress: 85, color: 'from-primary to-accent' },
                      { name: 'System Design', progress: 60, color: 'from-accent to-secondary' },
                      { name: 'Cloud (AWS)', progress: 40, color: 'from-secondary to-primary' }
                    ].map((skill, idx) => (
                      <div key={idx} className="group/skill">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-medium text-gray-700 group-hover/skill:text-primary transition-colors duration-300">{skill.name}</span>
                          <span className="text-sm font-semibold text-gray-900">{skill.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 group-hover/skill:animate-pulse`}
                            style={{ width: `${skill.progress}%`, transitionDelay: `${idx * 200}ms` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Card */}
                <div 
                  className="absolute bottom-20 right-12 w-[280px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-gray-100 hover:shadow-[0_25px_70px_rgba(39,66,69,0.35)] transition-all duration-700 hover:scale-105 cursor-pointer"
                  style={{ 
                    animation: 'float 8s ease-in-out infinite',
                    animationDelay: '2s',
                    transform: `translateY(${scrollY * 0.06}px)`
                  }}
                >
                  <div className="flex items-center gap-3 mb-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-md">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Learning Progress</p>
                      <p className="text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300">67%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-[67%] bg-gradient-to-r from-primary to-accent rounded-full animate-gradient-x" />
                    </div>
                    <Zap className="w-5 h-5 text-accent animate-pulse" />
                  </div>
                  <p className="text-xs text-gray-600 mt-3 flex items-center gap-1">
                    Keep up the great work! 
                    <span className="animate-bounce inline-block">🎉</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Scroll Indicator */}
          <div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform duration-300"
            style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <div className="flex flex-col items-center gap-2 text-accent group">
              <span className="text-sm font-medium group-hover:text-primary transition-colors duration-300">Scroll to explore</span>
              <div className="animate-bounce">
                <ChevronDown className="w-6 h-6 group-hover:scale-125 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Stagger Animation */}
      <section 
        className="relative py-40 px-4 bg-white"
        ref={el => observerRefs.current[0] = el}
        data-section="features"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6 hover:bg-accent/20 transition-colors duration-300 cursor-default group">
              <Sparkles className="w-4 h-4 text-primary group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-sm font-semibold text-primary">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6 hover:scale-105 transition-transform duration-300 inline-block">
              Everything You Need to
              <span className="block bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-gradient-x">Accelerate Your Career</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed hover:text-gray-700 transition-colors duration-300">
              Comprehensive tools powered by AI to guide you from where you are to where you want to be
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group ${isVisible.features ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="relative h-full p-8 hover:shadow-[0_25px_70px_rgba(39,66,69,0.25)] transition-all duration-700 overflow-hidden border-2 border-gray-100 hover:border-accent hover:-translate-y-3 cursor-pointer">
                  {/* Animated Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                  
                  {/* Radial Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} blur-2xl opacity-30`} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-lg group-hover:shadow-2xl`}>
                      <feature.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-dark group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <span className="text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 bg-accent/10 px-2 py-1 rounded-full">
                        {feature.stat}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 mb-4">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center text-accent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-sm font-semibold">Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Corner Accent with Animation */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-150" />
                  
                  {/* Bottom Glow */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* How It Works with Enhanced Parallax */}
<section 
  className="relative py-40 px-4 gradient-bg overflow-hidden"
  ref={el => observerRefs.current[1] = el}
  data-section="howitworks"
>
  <div className="absolute inset-0 opacity-10">
    <div className="absolute inset-0" style={{
      backgroundImage: 'radial-gradient(circle, rgba(223, 214, 174, 0.5) 2px, transparent 2px)',
      backgroundSize: '48px 48px',
      transform: `translateY(${scrollY * 0.05}px)`
    }}></div>
  </div>

  {/* Floating Particles */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-secondary/20 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ))}
  </div>

  <div className="max-w-7xl mx-auto relative z-10">
    <div className="text-center mb-24">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 hover:bg-white/20 transition-colors duration-300 cursor-default group">
        <Zap className="w-4 h-4 text-secondary group-hover:rotate-180 transition-transform duration-500" />
        <span className="text-sm font-semibold text-white">Simple Process</span>
      </div>
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 hover:scale-105 transition-transform duration-300 inline-block">
        From Profile to Dream Job
        <span className="block text-secondary">In 4 Simple Steps</span>
      </h2>
      <p className="text-xl text-secondary/90 max-w-2xl mx-auto hover:text-secondary transition-colors duration-300">
        Our streamlined process gets you from confusion to clarity
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className={`group ${isVisible.howitworks ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ 
            animationDelay: `${index * 150}ms`
          }}
        >
          <Card className="relative bg-white/10 backdrop-blur-xl border-2 border-white/20 p-8 hover:bg-white/20 hover:border-white/40 transition-all duration-700 h-full hover:scale-110 hover:shadow-[0_25px_70px_rgba(223,214,174,0.4)] cursor-pointer overflow-hidden">
            {/* Animated Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
            
            <div className="relative z-10">
              <div className="text-6xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 filter drop-shadow-2xl">
                {step.icon}
              </div>
              
              <div className="text-7xl font-bold text-white/20 mb-4 leading-none group-hover:text-secondary/40 group-hover:scale-110 transition-all duration-500">
                {step.number}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-secondary transition-colors duration-300">
                {step.title}
              </h3>
              
              <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                {step.description}
              </p>

              {/* Progress Indicator */}
              <div className="mt-6 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${step.color} w-0 group-hover:w-full transition-all duration-1000 ease-out`} />
              </div>
            </div>

            {/* Corner Glow with Pulse */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/30 rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl animate-pulse" />
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </Card>

          {/* Animated Connector with Flow Effect */}
          {index < steps.length - 1 && (
            <div className="hidden lg:block absolute top-1/2 -right-4 z-20">
              <div className="relative w-8 h-1 bg-secondary/30">
                <div className="absolute inset-0 bg-secondary/60 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                <div className="absolute inset-0 bg-secondary animate-pulse opacity-0 group-hover:opacity-100" />
              </div>
              <ArrowRight className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1 w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2" />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Final CTA with Magnetic Effect */}
      <section 
        className="relative py-40 px-4 bg-dark overflow-hidden"
        ref={el => observerRefs.current[2] = el}
        data-section="cta"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
            style={{ transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)` }}
          />
          <div 
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" 
            style={{ 
              animationDelay: '1s',
              transform: `translate(${-mousePosition.x * 0.1}px, ${-mousePosition.y * 0.1}px)` 
            }} 
          />
          <div 
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
            style={{ 
              animationDelay: '2s',
              transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)` 
            }} 
          />
        </div>

        <div className={`max-w-4xl mx-auto text-center relative z-10 ${isVisible.cta ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="mb-8 inline-block group">
            <Sparkles className="mx-auto text-secondary w-16 h-16 animate-pulse group-hover:rotate-180 group-hover:scale-125 transition-all duration-700 filter drop-shadow-2xl" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight hover:scale-105 transition-transform duration-500 inline-block">
            Ready to Transform
            <span className="block bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent animate-gradient-x">Your Career?</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed hover:text-white transition-colors duration-300">
            Start your journey today with <span className="font-semibold text-secondary">AI-powered career guidance</span>
          </p>
          <Link to="/signup" className="inline-block group">
            <Button
              size="lg"
              className="relative px-12 py-6 text-xl font-bold 
                        bg-secondary text-primary shadow-2xl 
                        hover:bg-yellow-500 hover:text-white 
                        hover:shadow-[0_25px_70px_rgba(255,215,0,0.5)] 
                        transition-all duration-500 hover:scale-110 overflow-hidden"
            >
              <span className="absolute inset-0 w-0 bg-yellow-400/30 transition-all duration-700 ease-out group-hover:w-full"></span>
              <Sparkles className="inline w-6 h-6 mr-3 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
              <span className="relative z-10">Get Started Free</span>
              <ArrowRight className="inline ml-3 w-6 h-6 group-hover:translate-x-3 transition-transform duration-300 relative z-10" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-primary text-white py-20 px-4 border-t border-accent/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6 group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold group-hover:text-secondary transition-colors duration-300">Career Catalyst</span>
              </div>
              <p className="text-gray-300 leading-relaxed hover:text-white transition-colors duration-300">
                AI-powered career guidance platform helping professionals achieve their dreams
              </p>
            </div>
            
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'How it Works'] },
              { title: 'Resources', links: ['Blog', 'Help Center', 'API Docs'] },
              { title: 'Company', links: ['About', 'Careers', 'Contact'] }
            ].map((section, idx) => (
              <div key={idx}>
                <h3 className="font-bold mb-6 text-secondary text-sm uppercase tracking-wider hover:text-accent transition-colors duration-300 cursor-default">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link 
                        to="/" 
                        className="text-gray-300 hover:text-white transition-all duration-300 inline-flex items-center group hover:translate-x-1"
                      >
                        {link}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ml-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-accent/20 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-300">
                © 2026 Career Catalyst. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                {['Privacy', 'Terms', 'Cookies'].map((item, idx) => (
                  <Link 
                    key={idx}
                    to="/" 
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-20px) rotate(2deg); 
          }
          66% { 
            transform: translateY(-10px) rotate(-2deg); 
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
