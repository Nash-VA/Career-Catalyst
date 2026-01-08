import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Target, TrendingUp, Award, BookOpen, Users, ArrowRight, 
  Play, Zap, Brain, BarChart3, ChevronDown
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI Career Matching',
      description: 'Machine learning analyzes your profile to recommend careers perfectly aligned with your skills and aspirations.',
      gradient: 'from-primary via-accent to-dark'
    },
    {
      icon: BarChart3,
      title: 'Skill Gap Analysis',
      description: 'Precision mapping identifies exactly what skills you need to develop to reach your target role.',
      gradient: 'from-accent via-primary to-dark'
    },
    {
      icon: Target,
      title: 'Personalized Roadmap',
      description: 'Step-by-step learning paths with milestones, curated resources, and progress tracking.',
      gradient: 'from-dark via-primary to-accent'
    },
    {
      icon: Award,
      title: 'Resume Optimizer',
      description: 'AI-powered analysis enhances your resume to match industry standards and highlight your strengths.',
      gradient: 'from-primary via-dark to-accent'
    },
    {
      icon: BookOpen,
      title: 'Course Curation',
      description: 'Access thousands of courses filtered specifically for your skill gaps and learning style.',
      gradient: 'from-accent via-dark to-primary'
    },
    {
      icon: Users,
      title: 'Interview Preparation',
      description: 'Practice with role-specific questions, get AI feedback, and track your improvement.',
      gradient: 'from-dark via-accent to-primary'
    }
  ];

  const steps = [
    { 
      number: '01', 
      icon: '📄',
      title: 'Upload Resume', 
      description: 'Quick profile creation with AI-powered resume parsing in seconds.'
    },
    { 
      number: '02', 
      icon: '🤖',
      title: 'AI Analysis', 
      description: 'Our ML models evaluate your profile to find your perfect career match.'
    },
    { 
      number: '03', 
      icon: '🗺️',
      title: 'Get Roadmap', 
      description: 'Receive personalized learning plan with timelines and resources.'
    },
    { 
      number: '04', 
      icon: '🚀',
      title: 'Take Action', 
      description: 'Start learning, track progress, and land interviews faster.'
    }
  ];

  return (
    <div className="min-h-screen bg-light overflow-hidden">
      <Navbar transparent />
      
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div 
          className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-accent rounded-full blur-3xl"
          style={{ transform: `translate(${scrollY * 0.15}px, ${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-secondary rounded-full blur-3xl"
          style={{ transform: `translate(${-scrollY * 0.1}px, ${-scrollY * 0.15}px)` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-4 pt-24 pb-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8 relative z-10">
              <div 
                className="inline-flex items-center gap-3 px-5 py-3 bg-accent/10 rounded-full shadow-lg animate-fade-in border border-accent/20"
                style={{ animationDelay: '0.1s' }}
              >
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </div>
                <span className="text-sm font-semibold text-primary">
                  AI-Powered Career Platform
                </span>
              </div>

              <div className="space-y-6">
                <h1 
                  className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] animate-slide-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="text-primary">Navigate Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                    Dream Career
                  </span>
                  <br />
                  <span className="text-dark">With AI</span>
                </h1>
                
                <p 
                  className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl animate-slide-up"
                  style={{ animationDelay: '0.3s' }}
                >
                  Get personalized career recommendations, bridge skill gaps, and accelerate your professional growth with AI-driven insights.
                </p>
              </div>

              <div 
                className="flex flex-col sm:flex-row gap-4 animate-slide-up"
                style={{ animationDelay: '0.4s' }}
              >
                <Link to="/signup" className="group">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto px-8 py-5 text-lg font-bold bg-primary hover:bg-accent text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="inline w-5 h-5 mr-2" />
                    Get Started Free
                    <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-8 py-5 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 group"
                  >
                    <Play className="inline mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Visual Element */}
            <div 
              ref={heroRef}
              className="relative hidden lg:block animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="relative w-full h-[700px]">
                {/* Floating Dashboard Card */}
                <div 
                  className="absolute top-0 right-0 w-[480px] bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-[0_20px_60px_rgba(39,66,69,0.3)] transition-all duration-500 hover:scale-105"
                  style={{ 
                    animation: 'float 6s ease-in-out infinite',
                    animationDelay: '0s' 
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Career Match Score</p>
                      <p className="text-4xl font-bold text-primary">98%</p>
                    </div>
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Senior Software Engineer</span>
                      <span className="text-green-600 font-semibold text-sm">Perfect Fit</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                        style={{ width: '98%' }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-4">
                      {['React', 'Node.js', 'TypeScript'].map((skill, idx) => (
                        <div key={idx} className="px-3 py-2 bg-accent/10 rounded-lg text-center hover:bg-accent/20 transition-colors duration-300 cursor-pointer">
                          <p className="text-xs font-semibold text-primary">{skill}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills Card */}
                <div 
                  className="absolute top-48 left-0 w-[360px] bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 hover:shadow-[0_20px_60px_rgba(39,66,69,0.3)] transition-all duration-500 hover:scale-105"
                  style={{ 
                    animation: 'float 7s ease-in-out infinite',
                    animationDelay: '1s' 
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Skills to Master</p>
                      <p className="text-2xl font-bold text-primary">3 Core</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'React.js', progress: 85 },
                      { name: 'System Design', progress: 60 },
                      { name: 'Cloud (AWS)', progress: 40 }
                    ].map((skill, idx) => (
                      <div key={idx} className="group">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{skill.name}</span>
                          <span className="text-sm font-semibold text-gray-900">{skill.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-1000 group-hover:from-primary group-hover:to-accent"
                            style={{ width: `${skill.progress}%`, transitionDelay: `${idx * 200}ms` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Card */}
                <div 
                  className="absolute bottom-20 right-12 w-[280px] bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 hover:shadow-[0_20px_60px_rgba(39,66,69,0.3)] transition-all duration-500 hover:scale-105"
                  style={{ 
                    animation: 'float 8s ease-in-out infinite',
                    animationDelay: '2s' 
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Learning Progress</p>
                      <p className="text-2xl font-bold text-primary">67%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-[67%] bg-gradient-to-r from-primary to-accent rounded-full" />
                    </div>
                    <Zap className="w-5 h-5 text-accent animate-pulse" />
                  </div>
                  <p className="text-xs text-gray-600 mt-3">Keep up the great work! 🎉</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
            style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
          >
            <div className="flex flex-col items-center gap-2 text-accent">
              <span className="text-sm font-medium">Scroll to explore</span>
              <ChevronDown className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Stays on Same View */}
      <section className="relative py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              Everything You Need to
              <span className="block text-accent">Accelerate Your Career</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools powered by AI to guide you from where you are to where you want to be
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group"
              >
                <Card className="relative h-full p-8 hover:shadow-[0_20px_60px_rgba(39,66,69,0.2)] transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-accent hover:-translate-y-2">
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-dark mb-4 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                    
                    <div className="mt-6 flex items-center text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-sm font-semibold">Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-4 gradient-bg overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(223, 214, 174, 0.5) 2px, transparent 2px)',
            backgroundSize: '48px 48px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold text-white">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              From Profile to Dream Job
              <span className="block text-secondary">In 4 Simple Steps</span>
            </h2>
            <p className="text-xl text-secondary/90 max-w-2xl mx-auto">
              Our streamlined process gets you from confusion to clarity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="group">
                <Card className="relative bg-white/10 backdrop-blur-xl border-2 border-white/20 p-8 hover:bg-white/20 hover:border-white/40 transition-all duration-500 h-full hover:scale-105 hover:shadow-[0_20px_60px_rgba(223,214,174,0.3)]">
                  <div className="text-6xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    {step.icon}
                  </div>
                  
                  <div className="text-7xl font-bold text-white/20 mb-4 leading-none group-hover:text-secondary/30 transition-colors duration-300">
                    {step.number}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-secondary transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300">
                    {step.description}
                  </p>

                  {/* Corner Glow */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                </Card>

                {/* Animated Connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-1 bg-secondary/30 z-10">
                    <div className="w-full h-full bg-secondary/60 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-4 bg-dark overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Sparkles className="mx-auto text-secondary w-16 h-16 mb-8 animate-pulse" />
          
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Ready to Transform
            <span className="block text-secondary">Your Career?</span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Start your journey today with AI-powered career guidance
          </p>

          <Link to="/signup">
            <Button 
              size="lg" 
              className="group px-12 py-6 text-xl font-bold bg-secondary hover:bg-white text-primary shadow-2xl hover:shadow-[0_20px_60px_rgba(223,214,174,0.4)] transition-all duration-300 hover:scale-110"
            >
              <Sparkles className="inline w-6 h-6 mr-3" />
              Get Started Free
              <ArrowRight className="inline ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-16 px-4 border-t border-accent/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold">Career Catalyst</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                AI-powered career guidance platform
              </p>
            </div>
            
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'How it Works'] },
              { title: 'Resources', links: ['Blog', 'Help Center', 'API Docs'] },
              { title: 'Company', links: ['About', 'Careers', 'Contact'] }
            ].map((section, idx) => (
              <div key={idx}>
                <h3 className="font-bold mb-6 text-secondary text-sm uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link 
                        to="/" 
                        className="text-gray-300 hover:text-white transition-colors inline-flex items-center group"
                      >
                        {link}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-accent/20 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2026 Career Catalyst. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-20px) rotate(1deg); 
          }
          66% { 
            transform: translateY(-10px) rotate(-1deg); 
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
