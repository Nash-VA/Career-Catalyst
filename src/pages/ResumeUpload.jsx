import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, CheckCircle, FileUp } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ResumeUpload = () => {
  const [hasResume, setHasResume] = useState(null);
  const [file, setFile] = useState(null);
  const { updateUserData } = useUser();
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      
      // Simulate resume parsing
      const mockParsedSkills = ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'Git'];
      const mockExperience = '2 years';
      
      updateUserData({ 
        resume: uploadedFile.name,
        parsedSkills: mockParsedSkills,
        experience: mockExperience
      });
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleContinue = () => {
    if (hasResume && file) {
      navigate('/onboarding');
    } else if (hasResume === false) {
      navigate('/onboarding');
    } else {
      alert('Please upload your resume or select "No, I don\'t have one"');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 py-12">
      <Card className="w-full max-w-2xl animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Let's Start Your Journey</h1>
          <p className="text-gray-600 text-lg">Do you have a resume ready?</p>
        </div>

        {hasResume === null && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setHasResume(true)}
              className="p-8 border-2 border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">Yes, I have one</h3>
              <p className="text-gray-600">Upload your resume to get personalized recommendations</p>
            </button>

            <button
              onClick={() => setHasResume(false)}
              className="p-8 border-2 border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">No, I don't have one</h3>
              <p className="text-gray-600">Answer questions to help us understand your profile</p>
            </button>
          </div>
        )}

        {hasResume === true && (
          <div className="mb-8">
            <Card className="text-center py-12 bg-light border-2 border-dashed border-primary">
              <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-dark mb-2">Upload Your Resume</h3>
              <p className="text-gray-600 mb-6">PDF format only, max 5MB</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button as="span" className="cursor-pointer">
                  Choose File
                </Button>
              </label>
              {file && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg inline-flex items-center space-x-3 border border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <p className="text-green-700 font-semibold">{file.name}</p>
                    <p className="text-green-600 text-sm">Resume uploaded successfully!</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {hasResume === false && (
          <div className="mb-8">
            <Card className="bg-blue-50 border border-blue-200">
              <div className="flex items-start space-x-3">
                <FileUp className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-bold text-dark mb-2">No worries!</h3>
                  <p className="text-gray-700">
                    We'll ask you a few questions about your education, skills, and career goals to provide personalized recommendations.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            onClick={() => setHasResume(null)}
            variant="ghost"
            disabled={hasResume === null}
          >
            ← Back
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={hasResume === null || (hasResume && !file)}
            size="lg"
          >
            Continue to Questions →
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResumeUpload;
