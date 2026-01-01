import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Target, TrendingUp, Award, BookOpen, Users, Zap, Star } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: <Sparkles size={48} color="var(--primary)" />,
      title: 'AI-Powered Recommendations',
      description: 'Machine learning algorithms analyze your profile to suggest perfect career matches tailored to your unique skills and interests.'
    },
    {
      icon: <Target size={48} color="var(--primary)" />,
      title: 'Skill Gap Analysis',
      description: 'Identify exactly what skills you need to develop to reach your dream career with detailed gap analysis and actionable insights.'
    },
    {
      icon: <TrendingUp size={48} color="var(--primary)" />,
      title: 'Personalized Roadmap',
      description: 'Get a step-by-step learning path with milestones, timelines, and resources to guide your career transformation journey.'
    },
    {
      icon: <Award size={48} color="var(--primary)" />,
      title: 'Resume Optimization',
      description: 'Build or enhance your resume with AI-powered suggestions that highlight your strengths and match industry standards.'
    },
    {
      icon: <BookOpen size={48} color="var(--primary)" />,
      title: 'Course Recommendations',
      description: 'Access curated learning resources and courses specifically matched to bridge your skill gaps and career objectives.'
    },
    {
      icon: <Users size={48} color="var(--primary)" />,
      title: 'Interview Preparation',
      description: 'Practice with career-specific interview questions and get expert tips to ace your next job interview with confidence.'
    }
  ];

  const steps = [
    { number: '01', title: 'Create Your Profile', description: 'Sign up and complete your profile with education, skills, and career interests.' },
    { number: '02', title: 'Get AI Analysis', description: 'Our AI analyzes your profile and recommends best-fit career paths.' },
    { number: '03', title: 'Identify Skill Gaps', description: 'Discover what skills you need to develop for your target career.' },
    { number: '04', title: 'Follow Your Roadmap', description: 'Access personalized learning paths, courses, and interview prep materials.' }
  ];

  // Calculate parallax values
  const heroParallax = scrollY * 0.5;
  const contentParallax = scrollY * 0.3;
  const opacity = Math.max(0, 1 - scrollY / 500);

  return (
    <div className="min-h-screen bg-dark overflow-hidden">
      <Navbar transparent />
      
      {/* Magical Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-secondary rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `translate(${(mousePosition.x - window.innerWidth / 2) * 0.01}px, ${(mousePosition.y - window.innerHeight / 2) * 0.01}px)`
            }}
          />
        ))}
      </div>

      {/* Hero Section with Advanced Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Layers */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-dark"
          style={{ transform: `translateY(${heroParallax}px) scale(${1 + scrollY * 0.0005})` }}
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-secondary to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Animated Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 left-20 w-96 h-96 bg-secondary rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"
            style={{ 
              transform: `translate(${heroParallax * 0.5}px, ${heroParallax * 0.3}px) scale(${1 + scrollY * 0.001})`,
              animation: 'float 8s infinite ease-in-out'
            }}
          ></div>
          <div 
            className="absolute top-40 right-20 w-80 h-80 bg-accent rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"
            style={{ 
              transform: `translate(${-heroParallax * 0.4}px, ${heroParallax * 0.6}px) scale(${1 + scrollY * 0.001})`,
              animation: 'float 10s infinite ease-in-out',
              animationDelay: '2s'
            }}
          ></div>
          <div 
            className="absolute bottom-20 left-1/2 w-72 h-72 bg-primary rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"
            style={{ 
              transform: `translate(${heroParallax * 0.3}px, ${-heroParallax * 0.4}px) scale(${1 + scrollY * 0.001})`,
              animation: 'float 12s infinite ease-in-out',
              animationDelay: '4s'
            }}
          ></div>
        </div>

        {/* Sparkle Effects */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-secondary animate-pulse"
              size={Math.random() * 20 + 10}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: opacity * Math.random(),
                animation: `twinkle ${2 + Math.random() * 3}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `translate(${(mousePosition.x - window.innerWidth / 2) * 0.02}px, ${(mousePosition.y - window.innerHeight / 2) * 0.02}px)`
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div 
          className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto"
          style={{ 
            transform: `translateY(${contentParallax}px)`,
            opacity: opacity
          }}
        >
          <div className="mb-8">
            <Zap 
              className="mx-auto mb-4 text-secondary animate-pulse" 
              size={64}
              style={{ filter: 'drop-shadow(0 0 20px rgba(223, 214, 174, 0.8))' }}
            />
          </div>
          
          <h1 
            className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
            style={{
              background: 'linear-gradient(to right, #ffffff, #DFD6AE, #ffffff)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 3s linear infinite'
            }}
          >
            Discover Your<br />Perfect Career Path
          </h1>
          
          <p 
            className="text-xl md:text-2xl mb-8 text-secondary max-w-3xl mx-auto"
            style={{ 
              textShadow: '0 0 20px rgba(223, 214, 174, 0.5)',
              animation: 'fadeIn 2s ease-in-out'
            }}
          >
            AI-powered career guidance platform that analyzes your skills, identifies gaps, 
            and provides personalized roadmaps to your dream career
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="min-w-[220px] bg-secondary text-primary hover:scale-110 hover:shadow-2xl transition-all duration-300 font-bold text-lg"
                style={{ boxShadow: '0 0 30px rgba(223, 214, 174, 0.5)' }}
              >
                <Sparkles className="inline mr-2" size={20} />
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                size="lg"
                variant="outline"
                className="min-w-[220px] bg-transparent text-white border-2 border-white/80 hover:bg-white/10 hover:scale-110 transition-all duration-300 font-semibold text-lg backdrop-blur-sm"
                style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
              >
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
        >
          <div className="w-6 h-10 border-2 border-secondary rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-secondary rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section - Fixed visibility issue */}
      <section className="relative py-32 px-4 bg-light min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-primary mb-4">
              Powerful Features for Your Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to navigate your career journey with confidence and clarity
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                hover 
                className="h-full hover:shadow-2xl transition-all duration-500 animate-slide-up"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)'
                }}
              >
                <div className="flex flex-col items-center text-center p-4">
                  <div className="mb-4 transform hover:scale-125 hover:rotate-12 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Magical Timeline */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-primary via-accent to-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #DFD6AE 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 text-white">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-secondary">
              Your magical journey to the perfect career in four enchanting steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 hover:bg-white/20 transition-all duration-500 hover:scale-105">
                  <div className="text-7xl font-bold text-secondary mb-4 animate-pulse">{step.number}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-secondary">{step.description}</p>
                </Card>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-4 w-8 h-1 bg-secondary opacity-50"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-4 bg-light relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-64 h-64 bg-primary rounded-full filter blur-3xl opacity-5"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${10 + Math.random() * 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '50+', label: 'Career Paths' },
              { value: '95%', label: 'Success Rate' }
            ].map((stat, index) => (
              <div key={index} className="p-8">
                <div className="text-7xl font-bold text-primary mb-4 hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <p className="text-2xl text-gray-600 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 gradient-bg overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-secondary to-transparent opacity-20 animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <div className="mb-8">
            <Sparkles className="mx-auto text-secondary animate-spin" size={64} style={{ animationDuration: '3s' }} />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-2xl mb-10 text-secondary">
            Join thousands of students and professionals who found their perfect career path
          </p>
          <Link to="/signup">
            <Button 
              size="lg" 
              className="min-w-[280px] bg-secondary text-primary hover:scale-110 hover:shadow-2xl transition-all duration-300 font-bold text-xl py-6"
              style={{ boxShadow: '0 0 40px rgba(223, 214, 174, 0.6)' }}
            >
              <Zap className="inline mr-2" size={24} />
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-12 px-4 border-t border-primary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white animate-pulse" />
                </div>
                <span className="text-2xl font-bold">Career Catalyst</span>
              </div>
              <p className="text-gray-400">Empowering careers through AI-driven insights</p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-secondary">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/signup" className="hover:text-secondary transition-colors">Features</Link></li>
                <li><Link to="/signup" className="hover:text-secondary transition-colors">Pricing</Link></li>
                <li><Link to="/signup" className="hover:text-secondary transition-colors">Resources</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-secondary">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-secondary transition-colors">About</Link></li>
                <li><Link to="/" className="hover:text-secondary transition-colors">Blog</Link></li>
                <li><Link to="/" className="hover:text-secondary transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-secondary">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-secondary transition-colors">Privacy</Link></li>
                <li><Link to="/" className="hover:text-secondary transition-colors">Terms</Link></li>
                <li><Link to="/" className="hover:text-secondary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary/30 pt-8 text-center">
            <p className="text-sm text-gray-500">© 2025 Career Catalyst. All rights reserved. Made with ✨ magic</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
