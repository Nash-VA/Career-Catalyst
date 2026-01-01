import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, User, LogOut, Settings, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import Button from '../common/Button';

const Navbar = ({ transparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

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

  const navClass = transparent 
    ? 'bg-transparent absolute w-full z-50' 
    : 'bg-white shadow-md';

  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const careerTitle = userData?.recommendedCareer?.title || 'Not set yet';

  return (
    <nav className={`${navClass} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            {/* Sparkles Logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {/* Brand Name */}
            <span className={`text-2xl font-bold ${transparent ? 'text-white' : 'text-primary'} group-hover:text-accent transition-colors duration-300`}>
              Career Catalyst
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className={`${transparent ? 'text-white' : 'text-dark'} hover:text-primary transition-colors px-3 py-2 font-medium`}>
                  Dashboard
                </Link>
                <Link to="/skills" className={`${transparent ? 'text-white' : 'text-dark'} hover:text-primary transition-colors px-3 py-2 font-medium`}>
                  Skills
                </Link>
                <Link to="/roadmap" className={`${transparent ? 'text-white' : 'text-dark'} hover:text-primary transition-colors px-3 py-2 font-medium`}>
                  Roadmap
                </Link>
                <Link to="/courses" className={`${transparent ? 'text-white' : 'text-dark'} hover:text-primary transition-colors px-3 py-2 font-medium`}>
                  Courses
                </Link>
                <Link to="/interview" className={`${transparent ? 'text-white' : 'text-dark'} hover:text-primary transition-colors px-3 py-2 font-medium`}>
                  Interview
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-dark font-medium">{userName}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-down z-50">
                      {/* User Info Section */}
                      <div className="bg-gradient-to-br from-primary to-accent p-4 text-white">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{userName}</h3>
                            <p className="text-secondary text-sm">{userEmail}</p>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                          <p className="text-xs text-secondary mb-1">Career Goal</p>
                          <p className="text-sm font-semibold">{careerTitle}</p>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-dark text-sm">Dashboard</p>
                            <p className="text-xs text-gray-500">View your progress</p>
                          </div>
                        </Link>

                        <Link
                          to="/resume-upload"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-dark text-sm">Update Resume</p>
                            <p className="text-xs text-gray-500">Modify your profile</p>
                          </div>
                        </Link>

                        <button
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setIsProfileOpen(false);
                            // Add settings navigation if you create a settings page
                          }}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-dark text-sm">Settings</p>
                            <p className="text-xs text-gray-500">Account preferences</p>
                          </div>
                        </button>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-gray-200 p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors rounded-lg group"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <LogOut className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-red-600 text-sm">Logout</p>
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
                <Link to="/login" className={`${transparent ? 'text-white' : 'text-dark'} hover:text-primary transition-colors font-medium`}>
                  Login
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`md:hidden ${transparent ? 'text-white' : 'text-dark'}`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            {user ? (
              <div className="flex flex-col space-y-2">
                {/* Mobile Profile Info */}
                <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-lg text-white mb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold">{userName}</h3>
                      <p className="text-secondary text-sm">{userEmail}</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <p className="text-xs text-secondary">Career Goal</p>
                    <p className="text-sm font-semibold">{careerTitle}</p>
                  </div>
                </div>

                <Link to="/dashboard" className="py-2 text-dark hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/skills" className="py-2 text-dark hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
                  Skills
                </Link>
                <Link to="/roadmap" className="py-2 text-dark hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
                  Roadmap
                </Link>
                <Link to="/courses" className="py-2 text-dark hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
                  Courses
                </Link>
                <Link to="/interview" className="py-2 text-dark hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
                  Interview
                </Link>
                <Link to="/resume-upload" className="py-2 text-dark hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
                  Update Resume
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }} 
                  className="py-2 text-left text-red-500 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/login" className="py-2 text-dark font-medium" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="py-2 text-primary font-medium" onClick={() => setIsOpen(false)}>
                  Sign Up
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
