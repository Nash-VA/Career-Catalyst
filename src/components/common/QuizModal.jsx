// src/components/common/QuizModal.jsx
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Brain, Sparkles } from 'lucide-react'; 
import { userAPI } from '../../services/api'; 
import Loading from './Loading'; 

const QuizModal = ({ skill, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch Quiz on Mount
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await userAPI.generateQuiz(skill);
        if (res.data.success && res.data.quiz?.questions?.length > 0) {
          setQuestions(res.data.quiz.questions);
        } else {
            setError("AI could not generate questions.");
        }
      } catch (err) {
        console.error(err);
        setError("AI failed to generate a quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [skill]);

  const handleAnswer = (optionIndex) => {
    const currentQ = questions[currentQIndex];
    if (optionIndex === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      finishQuiz(score + (optionIndex === currentQ.correctIndex ? 1 : 0));
    }
  };

  const finishQuiz = async (finalScore) => {
    setShowResult(true);
    if (finalScore >= 2) {
        try {
            await userAPI.verifySkill(skill, finalScore);
            setTimeout(() => {
                onSuccess(); 
            }, 2000);
        } catch (err) {
            setError("Failed to verify skill.");
        }
    }
  };

  if (!skill) return null;

  // --- STRICT VALIDATION HELPERS ---
  const currentQuestion = questions[currentQIndex];

  // 1. Is the Question Text ready?
  const isQuestionTextReady = currentQuestion && 
                              currentQuestion.question && 
                              typeof currentQuestion.question === 'string' &&
                              currentQuestion.question.trim().length > 5;

  // 2. Are the Options ready AND Valid? (Must be non-empty strings)
  const areOptionsReady = currentQuestion && 
                          Array.isArray(currentQuestion.options) && 
                          currentQuestion.options.length > 1 &&
                          currentQuestion.options.every(opt => (typeof opt === 'string' || typeof opt === 'number') && String(opt).trim() !== "");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 min-h-[450px] flex flex-col">
        
        {/* Header - Hide during initial load */}
        {!loading && (
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center shrink-0">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Verify Skill: <span className="text-primary">{skill}</span>
            </h3>
            <button onClick={onClose}><X className="w-5 h-5 text-gray-400 hover:text-red-500" /></button>
            </div>
        )}

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col justify-center">
          {loading ? (
             // ✅ PHASE 1: INITIAL FETCH
            <Loading 
                message="Generating Quiz..." 
                submessage="AI is analyzing this skill..." 
            />
          ) : error ? (
            <div className="text-center text-red-500 py-4 bg-red-50 rounded-lg">
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                {error}
                <button onClick={onClose} className="block w-full mt-4 text-sm font-bold underline">Close</button>
            </div>
          ) : showResult ? (
            <div className="text-center py-6">
              {score >= 2 ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900">Passed!</h2>
                  <p className="text-gray-600 mt-2">You answered {score}/{questions.length} correctly.</p>
                  <p className="text-sm text-green-600 font-medium mt-1">Skill marked as Mastered.</p>
                </>
              ) : (
                <>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900">Try Again</h2>
                  <p className="text-gray-600 mt-2">You scored {score}/{questions.length}. Need 2 to pass.</p>
                  <button onClick={onClose} className="mt-4 px-4 py-2 border rounded-lg hover:bg-gray-50">Close</button>
                </>
              )}
            </div>
          ) : (
            /* Question UI */
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2">
                <span>QUESTION {currentQIndex + 1} OF {questions.length}</span>
                <span>Score: {score}</span>
              </div>
              
              {/* Question Text Area */}
              <div className="min-h-[80px] mb-6">
                 {isQuestionTextReady ? (
                    <h4 className="text-lg font-medium text-gray-800 animate-in fade-in duration-300">
                        {currentQuestion.question}
                    </h4>
                 ) : (
                    // Fallback if question text is missing/short
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                 )}
              </div>

              <div className="space-y-3">
                {/* ✅ PHASE 2: OPTIONS VALIDATION 
                    We ONLY show buttons if `areOptionsReady` is strictly true.
                    Otherwise, we force the Loading Animation. 
                */}
                {areOptionsReady ? (
                    currentQuestion.options.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-blue-50 transition-all text-sm font-medium text-gray-700 shadow-sm hover:shadow-md animate-in slide-in-from-bottom-2 duration-300"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        {/* Safe render: Convert object to string if needed */}
                        {typeof opt === 'object' ? JSON.stringify(opt) : opt}
                    </button>
                    ))
                ) : (
                    // ✅ THE LOADING ANIMATION YOU WANTED
                    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <Sparkles className="w-10 h-10 text-primary animate-spin mb-4" />
                        <h5 className="text-primary font-semibold animate-pulse">Generating Options...</h5>
                        <p className="text-xs text-gray-500 mt-1">Curating the best answers</p>
                    </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;