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
  const { userData } = useUser();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
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

  // Always show solid navbar if not in transparent mode OR if scrolled
  const shouldBeTransparent = transparent && !scrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      shouldBeTransparent 
        ? 'bg-white/5 backdrop-blur-sm' 
        : 'bg-white shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            {/* Sparkles Logo */}
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {/* Brand Name */}
            <span className={`text-2xl font-bold transition-colors duration-300 ${
              shouldBeTransparent 
                ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
                : 'text-primary'
            } group-hover:text-accent`}>
              Career Catalyst
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`transition-all duration-300 px-4 py-2 font-semibold rounded-lg relative group ${
                    shouldBeTransparent
                      ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:bg-white/20'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link 
                  to="/skills" 
                  className={`transition-all duration-300 px-4 py-2 font-semibold rounded-lg relative group ${
                    shouldBeTransparent
                      ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:bg-white/20'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Skills
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link 
                  to="/roadmap" 
                  className={`transition-all duration-300 px-4 py-2 font-semibold rounded-lg relative group ${
                    shouldBeTransparent
                      ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:bg-white/20'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Roadmap
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link 
                  to="/courses" 
                  className={`transition-all duration-300 px-4 py-2 font-semibold rounded-lg relative group ${
                    shouldBeTransparent
                      ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:bg-white/20'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Courses
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link 
                  to="/interview" 
                  className={`transition-all duration-300 px-4 py-2 font-semibold rounded-lg relative group ${
                    shouldBeTransparent
                      ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:bg-white/20'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Interview
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative ml-2" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                      shouldBeTransparent 
                        ? 'hover:bg-white/20' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/20">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className={`font-semibold ${
                      shouldBeTransparent 
                        ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
                        : 'text-gray-700'
                    }`}>
                      {userName}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-down z-50">
                      {/* User Info Section */}
                      <div className="bg-gradient-to-br from-primary to-accent p-5 text-white">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm ring-2 ring-white/30">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{userName}</h3>
                            <p className="text-secondary text-sm">{userEmail}</p>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                          <p className="text-xs text-secondary mb-1">Career Goal</p>
                          <p className="text-sm font-semibold">{careerTitle}</p>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">Dashboard</p>
                            <p className="text-xs text-gray-500">View your progress</p>
                          </div>
                        </Link>

                        <Link
                          to="/resume-upload"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            <FileText className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">Update Resume</p>
                            <p className="text-xs text-gray-500">Modify your profile</p>
                          </div>
                        </Link>

                        <button
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                          onClick={() => {
                            setIsProfileOpen(false);
                          }}
                        >
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                            <Settings className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-semibold text-gray-900 text-sm">Settings</p>
                            <p className="text-xs text-gray-500">Account preferences</p>
                          </div>
                        </button>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-gray-200 p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors rounded-xl group"
                        >
                          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                            <LogOut className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-semibold text-red-600 text-sm">Logout</p>
                            <p className="text-xs text-red-400">Sign out of your account</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`transition-all duration-300 px-5 py-2.5 font-semibold rounded-lg ${
                    shouldBeTransparent
                      ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:bg-white/20'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  Login
                </Link>
                <Link to="/signup">
                  <Button 
                    className="bg-primary hover:bg-accent text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold px-6 py-2.5 rounded-lg"
                  >
                    Sign Up
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
                ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:bg-white/20' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-slide-down bg-white rounded-b-2xl mt-2 shadow-xl border-t border-gray-100">
            {user ? (
              <div className="flex flex-col space-y-1 p-4">
                {/* Mobile Profile Info */}
                <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-xl text-white mb-3 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg ring-2 ring-white/30">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{userName}</h3>
                      <p className="text-secondary text-sm">{userEmail}</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2.5">
                    <p className="text-xs text-secondary">Career Goal</p>
                    <p className="text-sm font-semibold">{careerTitle}</p>
                  </div>
                </div>

                <Link to="/dashboard" className="py-3 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg font-semibold transition-all" onClick={() => setIsOpen(false)}>
                  📊 Dashboard
                </Link>
                <Link to="/skills" className="py-3 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg font-semibold transition-all" onClick={() => setIsOpen(false)}>
                  ⚡ Skills
                </Link>
                <Link to="/roadmap" className="py-3 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg font-semibold transition-all" onClick={() => setIsOpen(false)}>
                  🗺️ Roadmap
                </Link>
                <Link to="/courses" className="py-3 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg font-semibold transition-all" onClick={() => setIsOpen(false)}>
                  📚 Courses
                </Link>
                <Link to="/interview" className="py-3 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg font-semibold transition-all" onClick={() => setIsOpen(false)}>
                  💼 Interview
                </Link>
                <Link to="/resume-upload" className="py-3 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg font-semibold transition-all" onClick={() => setIsOpen(false)}>
                  📄 Update Resume
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }} 
                  className="py-3 px-4 text-left text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-all"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 p-4">
                <Link to="/login" className="py-3 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg font-semibold transition-all text-center" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <Button 
                    className="w-full bg-primary hover:bg-accent text-white shadow-lg font-semibold py-3"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
