import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, FileUp } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ResumeUpload = () => {
  const navigate = useNavigate();

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

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* OPTION: YES - Direct Redirect to Builder */}
          <button
            onClick={() => navigate('/resume-builder')}
            className="p-8 border-2 border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 group text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">Create & Review</h3>
            <p className="text-gray-600 text-sm">Craft your resume or upload one to get it analyzed</p>
          </button>

          {/* OPTION: NO - Direct Redirect to Onboarding */}
          <button
            onClick={() => navigate('/onboarding')}
            className="p-8 border-2 border-gray-300 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 group text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FileUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">No, I don't have one</h3>
            <p className="text-gray-600 text-sm">Answer questions to help us understand your profile</p>
          </button>
        </div>

        {/* FOOTER NAVIGATION */}
        <div className="flex justify-center items-center mt-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
          >
            ← Back
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResumeUpload;