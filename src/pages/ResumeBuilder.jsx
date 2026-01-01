import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ResumeBuilder = () => {
  const { updateUserData } = useUser();
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      updateUserData({ resume: uploadedFile.name });
    } else {
      alert('Please upload a PDF file');
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Resume Builder</h1>
          <p className="text-gray-600 text-lg">Upload or create your professional resume</p>
        </div>

        <div className="flex space-x-4 mb-6">
          <Button
            onClick={() => setActiveTab('upload')}
            variant={activeTab === 'upload' ? 'primary' : 'outline'}
          >
            Upload Resume
          </Button>
          <Button
            onClick={() => setActiveTab('build')}
            variant={activeTab === 'build' ? 'primary' : 'outline'}
          >
            Build from Scratch
          </Button>
        </div>

        {activeTab === 'upload' ? (
          <Card className="text-center py-16">
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
              <div className="mt-6 p-4 bg-green-50 rounded-lg inline-flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">{file.name}</span>
              </div>
            )}
          </Card>
        ) : (
          <Card>
            <h3 className="text-2xl font-bold text-primary mb-6">Build Your Resume</h3>
            <p className="text-gray-600 mb-4">Answer a few questions to create your resume</p>
            <Button>Start Building</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
