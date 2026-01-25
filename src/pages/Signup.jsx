import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Calculate password strength
  useEffect(() => {
    if (password) {
      const strength = calculatePasswordStrength(password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, label: '', color: '' });
    }
  }, [password]);

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: '' };

    // Length check
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(pass)) score += 1; // lowercase
    if (/[A-Z]/.test(pass)) score += 1; // uppercase
    if (/[0-9]/.test(pass)) score += 1; // numbers
    if (/[^A-Za-z0-9]/.test(pass)) score += 1; // special characters

    // Return strength label and color
    if (score <= 2) return { score, label: 'Weak', color: 'text-red-500', bg: 'bg-red-500', width: '33%' };
    if (score <= 4) return { score, label: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500', width: '66%' };
    return { score, label: 'Strong', color: 'text-green-500', bg: 'bg-green-500', width: '100%' };
  };

  const validate = () => {
    const newErrors = {};
    
    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Please choose a stronger password';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  // Real-time validation
  useEffect(() => {
    if (touched.name || touched.email || touched.password || touched.confirmPassword) {
      setErrors(validate());
    }
  }, [name, email, password, confirmPassword, touched]);

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        await signup(name, email, password);
        setTimeout(() => {
          navigate('/resume-upload');
        }, 500);
      } catch (error) {
        setIsLoading(false);
        setErrors({ submit: 'Failed to create account. Please try again.' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const getPasswordRequirements = () => [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[a-z]/.test(password), text: 'One lowercase letter' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
    { met: /[^A-Za-z0-9]/.test(password), text: 'One special character' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className="w-full max-w-md animate-slide-up relative z-10 shadow-2xl border-2 border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Create Account</h1>
          <p className="text-gray-600">Start your career transformation today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="John Doe"
                className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  touched.name && errors.name
                    ? 'border-red-300 bg-red-50'
                    : touched.name && !errors.name
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              {touched.name && !errors.name && name && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>
            {touched.name && errors.name && (
              <div className="flex items-center gap-1 mt-2 text-red-500 text-sm animate-slide-down">
                <XCircle className="w-4 h-4" />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="your@email.com"
                className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  touched.email && errors.email
                    ? 'border-red-300 bg-red-50'
                    : touched.email && !errors.email
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              {touched.email && !errors.email && email && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>
            {touched.email && errors.email && (
              <div className="flex items-center gap-1 mt-2 text-red-500 text-sm animate-slide-down">
                <XCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  touched.password && errors.password
                    ? 'border-red-300 bg-red-50'
                    : touched.password && passwordStrength.score >= 3
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-3 space-y-2 animate-slide-down">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Password Strength:</span>
                  <span className={`text-sm font-semibold ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.bg} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: passwordStrength.width }}
                  ></div>
                </div>
              </div>
            )}

            {/* Password Requirements */}
            {password && (
              <div className="mt-3 space-y-2 animate-slide-down">
                {getPasswordRequirements().map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {req.met ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-300" />
                    )}
                    <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {touched.password && errors.password && (
              <div className="flex items-center gap-1 mt-2 text-red-500 text-sm animate-slide-down">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="••••••••"
                className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  touched.confirmPassword && errors.confirmPassword
                    ? 'border-red-300 bg-red-50'
                    : touched.confirmPassword && !errors.confirmPassword && confirmPassword
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {touched.confirmPassword && !errors.confirmPassword && confirmPassword && (
                <div className="absolute right-11 top-1/2 transform -translate-y-1/2 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && password && (
              <div className="mt-2 animate-slide-down">
                {password === confirmPassword ? (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Passwords match!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <XCircle className="w-4 h-4" />
                    <span>Passwords do not match</span>
                  </div>
                )}
              </div>
            )}

            {touched.confirmPassword && errors.confirmPassword && (
              <div className="flex items-center gap-1 mt-2 text-red-500 text-sm animate-slide-down">
                <XCircle className="w-4 h-4" />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-slide-down">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full mt-6 bg-primary hover:bg-accent text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              <>
                <span className="absolute inset-0 w-0 bg-white opacity-10 transition-all duration-500 ease-out group-hover:w-full"></span>
                <span className="relative flex items-center justify-center gap-2">
                  Create Account
                  <Sparkles className="w-5 h-5" />
                </span>
              </>
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-accent transition-colors duration-300 hover:underline">
              Login
            </Link>
          </p>

          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
