import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const { userData, updateUserData } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    education: '',
    fieldOfStudy: '',
    experience: userData.experience || '',
    currentRole: '',
    skills: userData.parsedSkills?.join(', ') || '',
    interests: '',
    careerGoals: '',
    preferredIndustry: ''
  });

  const totalSteps = 4;

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const skillsArray = formData.skills.split(',').map(s => s.trim());
    const interestsArray = formData.interests.split(',').map(i => i.trim());
    
    updateUserData({
      ...formData,
      skills: skillsArray,
      interests: interestsArray,
      completedOnboarding: true
    });
    
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-6">Educational Background</h2>
            <Input
              label="Highest Education Level"
              type="text"
              value={formData.education}
              onChange={(e) => handleChange('education', e.target.value)}
              placeholder="e.g., Bachelor's Degree, Master's, High School"
              required
            />
            <Input
              label="Field of Study"
              type="text"
              value={formData.fieldOfStudy}
              onChange={(e) => handleChange('fieldOfStudy', e.target.value)}
              placeholder="e.g., Computer Science, Business, Engineering"
              required
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-6">Experience & Current Role</h2>
            <Input
              label="Years of Experience"
              type="text"
              value={formData.experience}
              onChange={(e) => handleChange('experience', e.target.value)}
              placeholder="e.g., 2 years, Fresher, 5+ years"
              required
            />
            <Input
              label="Current Role (if any)"
              type="text"
              value={formData.currentRole}
              onChange={(e) => handleChange('currentRole', e.target.value)}
              placeholder="e.g., Junior Developer, Student, Marketing Intern"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-6">Skills & Expertise</h2>
            <Input
              label="Technical & Soft Skills (comma-separated)"
              type="text"
              value={formData.skills}
              onChange={(e) => handleChange('skills', e.target.value)}
              placeholder="e.g., JavaScript, Python, Communication, Problem Solving"
              required
            />
            <Input
              label="Areas of Interest (comma-separated)"
              type="text"
              value={formData.interests}
              onChange={(e) => handleChange('interests', e.target.value)}
              placeholder="e.g., Web Development, Data Analysis, Design, Marketing"
              required
            />
            <p className="text-sm text-gray-500">These help us recommend the best career path for you</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary mb-6">Career Goals & Preferences</h2>
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                What are your career goals? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.careerGoals}
                onChange={(e) => handleChange('careerGoals', e.target.value)}
                placeholder="Describe what you want to achieve in your career..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                required
              />
            </div>
            <Input
              label="Preferred Industry"
              type="text"
              value={formData.preferredIndustry}
              onChange={(e) => handleChange('preferredIndustry', e.target.value)}
              placeholder="e.g., Tech, Finance, Healthcare, Education"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 py-12">
      <Card className="w-full max-w-2xl animate-slide-up">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-primary">Step {step} of {totalSteps}</span>
            <span className="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="min-h-[300px]">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={handleBack}
            disabled={step === 1}
            variant="outline"
            className="flex items-center"
          >
            <ChevronLeft size={20} />
            Back
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              className="flex items-center"
            >
              Next
              <ChevronRight size={20} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex items-center"
            >
              Analyze & Continue
              <ChevronRight size={20} />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
