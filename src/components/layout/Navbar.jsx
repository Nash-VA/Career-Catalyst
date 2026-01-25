import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, User, LogOut, Settings, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import Button from '../common/Button';


const Navbar = ({ transparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { userData, clearUserData } = useUser();
  const navigate = useNavigate();
  const profileRef = useRef(null);


  const handleLogout = () => {
    logout();
    clearUserData(); // ✅ ADDED: Clear career data on logout
    setIsProfileOpen(false);
    navigate('/');
  };


  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const careerTitle = userData?.recommendedCareer?.title || 'Not set yet';


  const shouldBeTransparent = transparent && !scrolled;


  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        shouldBeTransparent 
          // NEW (Fully transparent)
? 'bg-transparent'

          : 'bg-white shadow-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section - IMPROVED */}
          {/* AFTER - WITH SPIN ANIMATION */}
<Link 
  to="/" // ✅ Always goes to landing page
  className="flex items-center space-x-2 group"
>
  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
    shouldBeTransparent 
      ? 'bg-primary shadow-lg' 
      : 'bg-primary'
  } group-hover:scale-110`}>
    <Sparkles className="w-6 h-6 text-white group-hover:animate-spin transition-transform" />
    {/* ✅ Added: group-hover:animate-spin */}
  </div>
  <span className={`text-xl font-bold transition-colors duration-300 ${
    shouldBeTransparent 
      ? 'text-gray-900' 
      : 'text-primary'
  }`}>
    Career Catalyst
  </span>
</Link>



          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    shouldBeTransparent
                      ? 'text-gray-700 hover:bg-gray-100' // ✅ FIXED: Visible
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/skills" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    shouldBeTransparent
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Skills
                </Link>
                <Link 
                  to="/roadmap" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    shouldBeTransparent
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Roadmap
                </Link>
                <Link 
                  to="/courses" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    shouldBeTransparent
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Courses
                </Link>
                <Link 
                  to="/interview" 
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    shouldBeTransparent
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Interview
                </Link>


                {/* Profile Dropdown */}
                <div className="relative ml-3" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                      shouldBeTransparent
                        ? 'hover:bg-gray-100'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${ shouldBeTransparent 
                        ? 'bg-primary text-white' // ✅ FIXED: Solid avatar
                        : 'bg-primary text-white'
                    }`}>
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className={`font-medium ${
                      shouldBeTransparent ? 'text-gray-700' : 'text-gray-700'
                    }`}>
                      {userName}
                    </span>
                  </button>


                  {/* Dropdown Menu (unchanged) */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg py-2 border border-gray-200 animate-slide-up">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{userName}</p>
                            <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                          </div>
                        </div>
                        <div className="mt-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600 font-medium">Career Goal</p>
                          <p className="text-sm text-primary font-semibold truncate">{careerTitle}</p>
                        </div>
                      </div>

                      <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                        <TrendingUp size={18} className="text-primary" />
                        <div>
                          <p className="font-medium text-gray-900">Dashboard</p>
                          <p className="text-xs text-gray-500">View your progress</p>
                        </div>
                      </Link>

                      <Link to="/resume-upload" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                        <FileText size={18} className="text-primary" />
                        <div>
                          <p className="font-medium text-gray-900">Update Resume</p>
                          <p className="text-xs text-gray-500">Modify your profile</p>
                        </div>
                      </Link>

                      <button onClick={() => { alert('Settings feature coming soon!'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                        <Settings size={18} className="text-primary" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Settings</p>
                          <p className="text-xs text-gray-500">Account preferences</p>
                        </div>
                      </button>

                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut size={18} />
                          <div className="text-left">
                            <p className="font-medium">Logout</p>
                            <p className="text-xs text-red-500">Sign out of your account</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className={shouldBeTransparent 
                      ? 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white shadow-md' // ✅ FIXED
                      : ''
                    }
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    className={shouldBeTransparent 
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-md' // ✅ FIXED
                      : ''
                    }
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>


          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2.5 rounded-xl transition-all duration-300 ${
              shouldBeTransparent
                ? 'text-gray-900 hover:bg-gray-100 bg-white/80 shadow-sm' // ✅ FIXED
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>


      {/* Mobile Menu (unchanged) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          {user ? (
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{userName}</p>
                  <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                </div>
              </div>

              <div className="px-3 py-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">Career Goal</p>
                <p className="text-sm text-primary font-semibold">{careerTitle}</p>
              </div>

              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-3 px-4 text-left text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all">📊 Dashboard</Link>
              <Link to="/skills" onClick={() => setIsOpen(false)} className="block py-3 px-4 text-left text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all">⚡ Skills</Link>
              <Link to="/roadmap" onClick={() => setIsOpen(false)} className="block py-3 px-4 text-left text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all">🗺️ Roadmap</Link>
              <Link to="/courses" onClick={() => setIsOpen(false)} className="block py-3 px-4 text-left text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all">📚 Courses</Link>
              <Link to="/interview" onClick={() => setIsOpen(false)} className="block py-3 px-4 text-left text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all">💼 Interview</Link>
              <Link to="/resume-upload" onClick={() => setIsOpen(false)} className="block py-3 px-4 text-left text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all">📄 Update Resume</Link>

              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full py-3 px-4 text-left text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-all">🚪 Logout</button>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-3">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};


export default Navbar;
