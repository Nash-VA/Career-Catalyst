import React, { useState } from 'react';
import { MessageSquare, CheckCircle, Lightbulb, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const InterviewPrep = () => {
  const { userData } = useUser();
  const navigate = useNavigate();
  const career = userData.recommendedCareer;
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');

  if (!career) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">No Career Recommendation Yet</h2>
          <p className="text-gray-600 mb-6">Please complete your profile first to get career recommendations</p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Generate interview questions based on career
  const generateQuestions = () => {
    const commonQuestions = [
      'Tell me about yourself and your background',
      'Why are you interested in this role?',
      'What are your greatest strengths?',
      'Describe a challenging situation you faced and how you handled it',
      'Where do you see yourself in 5 years?'
    ];

    const technicalQuestions = {
      'Full Stack Developer': [
        'Explain the difference between REST and GraphQL',
        'How do you optimize website performance?',
        'Describe your experience with version control',
        'Walk me through building a full-stack application',
        'How do you handle authentication and security?'
      ],
      'Data Scientist': [
        'Explain the bias-variance tradeoff',
        'How do you handle missing data in datasets?',
        'Describe a machine learning project you completed',
        'What is your approach to feature engineering?',
        'How do you evaluate and validate models?'
      ],
      'UX/UI Designer': [
        'Walk me through your design process',
        'How do you conduct user research?',
        'Describe a time you had to defend your design decisions',
        'How do you ensure accessibility in your designs?',
        'What tools do you use for prototyping?'
      ]
    };

    const careerSpecific = technicalQuestions[career.title] || [
      `What experience do you have with ${career.requiredSkills?.[0]}?`,
      `How would you approach learning ${career.skillGap?.[0]}?`,
      'Describe a project relevant to this role',
      'What makes you a good fit for this position?',
      'How do you stay updated with industry trends?'
    ];

    return {
      common: commonQuestions,
      technical: careerSpecific
    };
  };

  const questions = generateQuestions();
  const allQuestions = [...questions.common, ...questions.technical];

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-primary mb-2">Interview Preparation</h1>
          <p className="text-gray-600 text-lg">
            Practice interview questions for {career.title}
          </p>
        </div>

        {/* Career Info Card */}
        <Card gradient className="mb-8 text-white animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                {career.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Preparing for: {career.title}</h2>
                <p className="text-secondary">Practice both common and technical questions</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Questions List */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-xl font-bold text-dark mb-4">Practice Questions</h3>
              
              {/* Common Questions */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase">Common Questions</h4>
                <div className="space-y-2">
                  {questions.common.map((question, index) => (
                    <button
                      key={`common-${index}`}
                      onClick={() => setSelectedQuestion({ type: 'common', index, question })}
                      className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                        selectedQuestion?.type === 'common' && selectedQuestion?.index === index
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold">{index + 1}.</span>
                        <span className="flex-1">{question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Questions */}
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase">Technical Questions</h4>
                <div className="space-y-2">
                  {questions.technical.map((question, index) => (
                    <button
                      key={`tech-${index}`}
                      onClick={() => setSelectedQuestion({ type: 'technical', index, question })}
                      className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                        selectedQuestion?.type === 'technical' && selectedQuestion?.index === index
                          ? 'bg-primary text-white'
                          : 'bg-blue-50 hover:bg-blue-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold">{questions.common.length + index + 1}.</span>
                        <span className="flex-1">{question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Answer Area */}
          <div className="lg:col-span-2">
            {selectedQuestion ? (
              <Card>
                <div className="flex items-start gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                      selectedQuestion.type === 'common' 
                        ? 'bg-gray-100 text-gray-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedQuestion.type === 'common' ? 'COMMON QUESTION' : 'TECHNICAL QUESTION'}
                    </span>
                    <h3 className="text-2xl font-bold text-dark">
                      {selectedQuestion.question}
                    </h3>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-dark mb-2">
                    Your Answer
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here... Use the STAR method (Situation, Task, Action, Result) for behavioral questions."
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>

                <Button className="w-full mb-6">Get AI Feedback on Your Answer</Button>

                {/* Tips Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Tips for this question:
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    {selectedQuestion.type === 'common' ? (
                      <>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span>Be specific and use concrete examples from your experience</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span>Structure your answer using the STAR method</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span>Keep your answer concise (2-3 minutes maximum)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span>Show enthusiasm and genuine interest</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span>Demonstrate your technical knowledge clearly</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span>Use examples from real projects you've worked on</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span>Explain your problem-solving approach</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                          <span>Relate your answer to the job requirements</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </Card>
            ) : (
              <Card className="text-center py-16">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-dark mb-2">Select a Question</h3>
                <p className="text-gray-600">Choose a question from the list to start practicing</p>
              </Card>
            )}
          </div>
        </div>

        {/* Preparation Checklist */}
        <Card className="mt-8 gradient-bg text-white">
          <h3 className="text-2xl font-bold mb-4">Interview Preparation Checklist</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Research the company and role thoroughly',
              'Prepare STAR method examples from your experience',
              'Practice technical questions related to required skills',
              'Prepare thoughtful questions to ask the interviewer',
              'Review your resume and be ready to discuss all points',
              'Practice mock interviews with friends or mentors',
              'Prepare your workspace for virtual interviews',
              'Plan your professional attire'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 bg-white/10 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InterviewPrep;
