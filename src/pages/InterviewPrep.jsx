import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Lightbulb, AlertCircle, Loader2, Sparkles, TrendingUp, Award } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const InterviewPrep = () => {
  const { userData } = useUser();
  const navigate = useNavigate();
  const career = userData.recommendedCareer;
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [questions, setQuestions] = useState({ common: [], technical: [] });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    const fetchAIQuestions = async () => {
      if (!career) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/interview-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            career_title: career.title,
            required_skills: career.requiredSkills || [],
            skill_gaps: career.skillGap || []
          })
        });

        const data = await response.json();

        if (data.success && data.questions) {
          const commonQuestions = data.questions
            .filter(q => q.category === 'behavioral' || q.category === 'common')
            .map(q => q.question);
          
          const technicalQuestions = data.questions
            .filter(q => q.category === 'technical')
            .map(q => q.question);

          setQuestions({
            common: commonQuestions.length > 0 ? commonQuestions : generateFallbackQuestions().common,
            technical: technicalQuestions.length > 0 ? technicalQuestions : generateFallbackQuestions().technical
          });
        } else {
          setQuestions(generateFallbackQuestions());
        }
      } catch (error) {
        console.error('Failed to fetch AI questions:', error);
        setQuestions(generateFallbackQuestions());
      } finally {
        setLoading(false);
      }
    };

    fetchAIQuestions();
  }, [career]);

  const generateFallbackQuestions = () => {
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

    const careerSpecific = technicalQuestions[career?.title] || [
      `What experience do you have with ${career?.requiredSkills?.[0]}?`,
      `How would you approach learning ${career?.skillGap?.[0]}?`,
      'Describe a project relevant to this role',
      'What makes you a good fit for this position?',
      'How do you stay updated with industry trends?'
    ];

    return {
      common: commonQuestions,
      technical: careerSpecific
    };
  };

  const getAIFeedback = async () => {
    if (!answer.trim()) {
      alert('Please write an answer first!');
      return;
    }

    try {
      setFeedbackLoading(true);
      setFeedback(null);

      const response = await fetch('http://localhost:5001/api/interview-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: selectedQuestion.question,
          answer: answer,
          career_title: career.title,
          question_type: selectedQuestion.type
        })
      });

      const data = await response.json();

      if (data.success) {
        setFeedback(data.feedback);
      } else {
        setFeedback({
          score: 7,
          strengths: ['Your answer shows relevant experience', 'Good structure'],
          improvements: ['Add more specific examples', 'Elaborate on the results'],
          suggestions: 'Consider using the STAR method for a more structured response.'
        });
      }
    } catch (error) {
      console.error('Failed to get AI feedback:', error);
      setFeedback({
        score: 7,
        strengths: ['Your answer is well-structured'],
        improvements: ['Add more specific details'],
        suggestions: 'Practice articulating your thoughts clearly and concisely.'
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

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

if (loading) {
  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4">
        <Loading 
          message="Loading AI-powered interview questions..." 
          submessage="Generating personalized questions for you"
        />
      </div>
    </div>
  );
}

  const totalQuestions = questions.common.length + questions.technical.length;

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Clean Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Interview Preparation</h1>
          </div>
          <p className="text-gray-600 text-base pl-11">
            Practice AI-generated questions for <span className="font-semibold text-primary">{career.title}</span>
          </p>
        </div>

        {/* Stats Card - Compact Horizontal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{career.icon}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Preparing for</p>
              <p className="font-bold text-dark">{career.title}</p>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div>
            <p className="text-sm text-gray-600">Total Questions</p>
            <p className="font-bold text-primary text-xl">{totalQuestions}</p>
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div>
            <p className="text-sm text-gray-600">Behavioral</p>
            <p className="font-bold text-gray-700">{questions.common.length}</p>
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div>
            <p className="text-sm text-gray-600">Technical</p>
            <p className="font-bold text-gray-700">{questions.technical.length}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Questions Sidebar - Cleaner */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Question Bank
              </h3>
              
              {/* Common Questions */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Behavioral</h4>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full font-medium">{questions.common.length}</span>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {questions.common.map((question, index) => (
                    <button
                      key={`common-${index}`}
                      onClick={() => {
                        setSelectedQuestion({ type: 'common', index, question });
                        setAnswer('');
                        setFeedback(null);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg transition-all text-xs ${
                        selectedQuestion?.type === 'common' && selectedQuestion?.index === index
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-semibold flex-shrink-0">{index + 1}.</span>
                        <span className="flex-1 line-clamp-2">{question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Questions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Technical</h4>
                  <span className="text-xs bg-blue-100 px-2 py-0.5 rounded-full font-medium text-blue-700">{questions.technical.length}</span>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {questions.technical.map((question, index) => (
                    <button
                      key={`tech-${index}`}
                      onClick={() => {
                        setSelectedQuestion({ type: 'technical', index, question });
                        setAnswer('');
                        setFeedback(null);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg transition-all text-xs ${
                        selectedQuestion?.type === 'technical' && selectedQuestion?.index === index
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-blue-50 hover:bg-blue-100 text-gray-700 border border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-semibold flex-shrink-0">{questions.common.length + index + 1}.</span>
                        <span className="flex-1 line-clamp-2">{question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Answer Area - Much Cleaner */}
          <div className="lg:col-span-2">
            {selectedQuestion ? (
              <div className="space-y-4">
                {/* Question Card */}
                <Card>
                  <div className="flex items-start gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedQuestion.type === 'common' 
                        ? 'bg-gray-100 text-gray-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedQuestion.type === 'common' ? 'BEHAVIORAL' : 'TECHNICAL'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-dark leading-relaxed">
                    {selectedQuestion.question}
                  </h3>
                </Card>

                {/* Answer Input */}
                <Card>
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Your Answer
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here... For behavioral questions, use the STAR method (Situation, Task, Action, Result)."
                    rows="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  
                  <Button 
                    onClick={getAIFeedback} 
                    className="w-full mt-4 flex items-center justify-center gap-2"
                    disabled={feedbackLoading || !answer.trim()}
                  >
                    {feedbackLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing your answer...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Get AI Feedback
                      </>
                    )}
                  </Button>
                </Card>

                {/* AI Feedback - Clean Design */}
                {feedback && (
                  <Card className="border-l-4 border-l-primary">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-lg text-dark flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI Feedback
                      </h4>
                      <div className="bg-primary text-white px-4 py-1.5 rounded-full">
                        <span className="font-bold">{feedback.score || 7}/10</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Strengths */}
                      <div>
                        <h5 className="font-semibold text-green-700 mb-2 text-sm flex items-center gap-1">
                          <CheckCircle size={16} />
                          Strengths
                        </h5>
                        <ul className="space-y-1.5">
                          {(feedback.strengths || []).map((strength, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 p-2 rounded border-l-2 border-green-400">
                              <span>•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Improvements */}
                      <div>
                        <h5 className="font-semibold text-orange-700 mb-2 text-sm flex items-center gap-1">
                          <TrendingUp size={16} />
                          Areas for Improvement
                        </h5>
                        <ul className="space-y-1.5">
                          {(feedback.improvements || []).map((improvement, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-orange-50 p-2 rounded border-l-2 border-orange-400">
                              <span>•</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Suggestions */}
                      {feedback.suggestions && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h5 className="font-semibold text-blue-700 mb-1 text-sm">💡 Suggestion</h5>
                          <p className="text-sm text-gray-700">{feedback.suggestions}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Tips - Compact */}
                <Card className="bg-blue-50 border-blue-200">
                  <h4 className="font-semibold text-primary mb-3 text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Quick Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {selectedQuestion.type === 'common' ? (
                      <>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Use specific examples from your experience</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Structure with STAR method (Situation, Task, Action, Result)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Keep answers concise (2-3 minutes)</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Demonstrate clear technical knowledge</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Reference real projects you've worked on</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Explain your problem-solving process</span>
                        </li>
                      </>
                    )}
                  </ul>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-20">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-dark mb-2">Select a Question to Start</h3>
                <p className="text-gray-500">Choose any question from the sidebar to begin practicing</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
