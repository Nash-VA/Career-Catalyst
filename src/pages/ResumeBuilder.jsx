import React, { useState, useRef } from 'react';
import { 
  FileText, Download, Bot, ChevronLeft, ChevronRight, 
  Sparkles, User, Briefcase, GraduationCap, Code, Upload, Loader2, Wand2, Check, ArrowLeft, AlertCircle 
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5001/api';

// =================================================================
// 1. CUSTOM STYLES (Professional Dark Theme Scrollbar)
// =================================================================
const CustomScrollbarStyles = () => (
  <style>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(223, 214, 174, 0.2);
      border-radius: 10px;
      transition: all 0.3s ease;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(223, 214, 174, 0.5);
    }
    /* Firefox Support */
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(223, 214, 174, 0.2) transparent;
    }
  `}</style>
);

// =================================================================
// 2. INPUT COMPONENTS
// =================================================================

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-[#DFD6AE] uppercase tracking-wider ml-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:border-[#DFD6AE] focus:ring-1 focus:ring-[#DFD6AE] transition-all outline-none"
    />
  </div>
);

const TextAreaField = ({ label, fieldName, value, onChange, placeholder, onSuggest, onPolish, loadingState }) => {
  const isSuggesting = loadingState.field === fieldName && loadingState.type === 'suggest';
  const isPolishing = loadingState.field === fieldName && loadingState.type === 'polish';

  return (
    <div className="space-y-2 h-full flex flex-col">
       <div className="flex justify-between items-end">
        <label className="text-xs font-bold text-[#DFD6AE] uppercase tracking-wider ml-1">{label}</label>
        <div className="flex gap-2">
          <button 
            onClick={() => onSuggest(fieldName)}
            disabled={isSuggesting || isPolishing}
            className="flex items-center gap-1 text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md text-white transition-colors border border-white/5 disabled:opacity-50"
          >
            {isSuggesting ? <Loader2 size={12} className="animate-spin"/> : <Bot size={12} />}
            Suggest
          </button>
          
          <button 
            onClick={() => onPolish(fieldName)}
            disabled={isSuggesting || isPolishing}
            className="flex items-center gap-1 text-[10px] bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 px-3 py-1.5 rounded-md text-blue-200 transition-all border border-blue-500/30 disabled:opacity-50"
          >
            {isPolishing ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
            Polish
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full flex-1 p-5 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:border-[#DFD6AE] focus:ring-1 focus:ring-[#DFD6AE] transition-all outline-none resize-none leading-relaxed min-h-[300px] font-mono text-sm custom-scrollbar"
      />
      <p className="text-[10px] text-white/30 text-right italic">
        {value.trim() === '' ? 'Empty sections will be hidden in PDF' : 'Section active'}
      </p>
    </div>
  );
};

// =================================================================
// 3. MAIN COMPONENT
// =================================================================

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState({ field: null, type: null });
  // New state for error handling
  const [uploadError, setUploadError] = useState(null); 
  const printRef = useRef(null);

  const [resume, setResume] = useState({
    name: '', email: '', phone: '', location: '', linkedin: '',
    summary: '', skills: '', experience: '', projects: '', 
    training: '', education: '', languages: '', hobbies: ''
  });

  const [suggestions, setSuggestions] = useState([]);
  const [analysisScore, setAnalysisScore] = useState(null);
  const [critique, setCritique] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // --- VALIDATION START ---
    const allowedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/plain' // .txt
    ];

    // Check mime type or extension
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|doc|txt)$/i)) {
      setUploadError("Invalid input: add only in document format");
      e.target.value = ''; // Reset the input
      return;
    }

    // Clear error if valid
    setUploadError(null);
    // --- VALIDATION END ---

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_role', 'Developer');

    try {
      const res = await axios.post(`${API_BASE_URL}/resume/upload-analyze`, formData);
      if (res.data.success) {
        const { overall_score, headline_feedback, critical_issues } = res.data.data;
        setAnalysisScore(overall_score);
        setCritique({ headline: headline_feedback, issues: critical_issues });
      }
    } catch (err) {
      console.error("Analysis failed", err);
      setUploadError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const fetchSuggestions = async (currentField) => {
    setLoadingState({ field: currentField, type: 'suggest' });
    try {
      const res = await axios.post(`${API_BASE_URL}/resume/suggest`, { section: currentField, input: resume[currentField] });
      if (res.data.success) setSuggestions(res.data.suggestions);
    } catch (err) { console.error(err); } 
    finally { setLoadingState({ field: null, type: null }); }
  };

  const handlePolish = async (field) => {
    const text = resume[field];
    if (!text) return;
    setLoadingState({ field: field, type: 'polish' });
    try {
      const res = await axios.post(`${API_BASE_URL}/resume/polish`, { text });
      if (res.data.success && res.data.data.polished_options) {
        updateField(field, res.data.data.polished_options[0]);
        setSuggestions(res.data.data.polished_options);
      }
    } catch (err) { console.error(err); } 
    finally { setLoadingState({ field: null, type: null }); }
  };

  const updateField = (field, value) => setResume(prev => ({ ...prev, [field]: value }));
  
  const applySuggestion = (text) => {
    const currentField = steps[step].field;
    if (currentField === 'personal') return;
    const currentVal = resume[currentField];
    updateField(currentField, currentVal ? `${currentVal}\n• ${text}` : text);
  };
  
  const nextStep = () => { setStep(Math.min(step + 1, steps.length - 1)); setSuggestions([]); };
  const prevStep = () => setStep(Math.max(step - 1, 0));

  const exportPDF = () => {
    if (printRef.current) {
      const content = printRef.current.innerHTML;
      const win = window.open('', '', 'height=700,width=1000');
      win.document.write(`
        <html>
          <head>
            <title>${resume.name || 'Resume'}</title>
            <style>
              @page { size: A4; margin: 0; }
              body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: white; color: #333; }
              .page { width: 210mm; min-height: 297mm; padding: 12mm 15mm; box-sizing: border-box; background: white; }
              h1.name { font-size: 32px; font-weight: 800; color: #2563eb; text-transform: uppercase; margin: 0 0 5px 0; }
              .contact-line { font-size: 10px; color: #666; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 15px; }
              h2.section-title { font-size: 14px; font-weight: bold; color: #2563eb; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 3px; margin: 15px 0 8px 0; }
              p, li, div { font-size: 10.5px; line-height: 1.5; color: #333; margin-bottom: 4px; }
            </style>
          </head>
          <body><div class="page">${content}</div></body>
        </html>
      `);
      win.document.close();
      setTimeout(() => { win.focus(); win.print(); }, 500);
    }
  };

  const steps = [
    { label: 'Personal', icon: User, field: 'personal' },
    { label: 'Summary', icon: FileText, field: 'summary' },
    { label: 'Skills', icon: Code, field: 'skills' },
    { label: 'Experience', icon: Briefcase, field: 'experience' },
    { label: 'Projects', icon: Sparkles, field: 'projects' },
    { label: 'Training', icon: FileText, field: 'training' },
    { label: 'Education', icon: GraduationCap, field: 'education' },
    { label: 'Details', icon: User, field: 'details' },
    { label: 'Preview', icon: Download, field: 'preview' }
  ];

  return (
    <div className="min-h-screen bg-[#1a2630] text-white font-sans flex flex-col">
      <CustomScrollbarStyles />
      
      {/* STICKY HEADER WITH HISTORY BACK */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#1a2630]/50 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-white/60 hover:text-[#DFD6AE] transition-colors text-sm group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Back
          </button>
          
          <div className="flex items-center gap-4">
             {/* ERROR MESSAGE DISPLAY */}
             {uploadError && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20 text-xs animate-in fade-in slide-in-from-right-5">
                  <AlertCircle size={14} />
                  {uploadError}
                </div>
              )}

             <div className="relative">
                {/* Accept attribute updated for user guidance, JS validation handles actual logic */}
                <input type="file" accept=".pdf,.txt,.docx" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-[10px] font-bold uppercase tracking-widest">
                  {loading ? <Loader2 size={14} className="animate-spin"/> : <Upload size={14} />}
                  {analysisScore ? `Analysis: ${analysisScore}%` : 'Analyze File'}
                </button>
              </div>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 h-full min-h-0">
          
          {/* LEFT: EDITOR */}
          <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
            <div className="flex items-center gap-2 bg-[#243441] p-2 rounded-2xl border border-white/5 overflow-x-auto custom-scrollbar shrink-0">
              {steps.map((s, idx) => (
                <button key={idx} onClick={() => setStep(idx)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap ${step === idx ? 'bg-[#DFD6AE] text-[#1a2630]' : 'text-white/40 hover:bg-white/5'}`}>
                  <s.icon size={12} /> {s.label}
                </button>
              ))}
            </div>

            <div className="bg-[#243441] rounded-3xl border border-white/5 shadow-2xl p-6 flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {step === 0 && (
                  <div className="grid md:grid-cols-2 gap-5">
                    <InputField label="Name" value={resume.name} onChange={(e) => updateField('name', e.target.value)} placeholder="JAMES DOE" />
                    <InputField label="Email" value={resume.email} onChange={(e) => updateField('email', e.target.value)} placeholder="james@email.com" />
                    <InputField label="Phone" value={resume.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+1 234 567 890" />
                    <InputField label="Location" value={resume.location} onChange={(e) => updateField('location', e.target.value)} placeholder="City, Country" />
                    <InputField label="LinkedIn" value={resume.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} placeholder="linkedin.com/in/james" />
                  </div>
                )}
                
                {steps[step].field === 'details' && (
                    <div className="space-y-6">
                      <TextAreaField label="Languages" fieldName="languages" value={resume.languages} onChange={(e) => updateField('languages', e.target.value)} placeholder="English, French..." onSuggest={fetchSuggestions} onPolish={handlePolish} loadingState={loadingState} />
                      <TextAreaField label="Hobbies" fieldName="hobbies" value={resume.hobbies} onChange={(e) => updateField('hobbies', e.target.value)} placeholder="Coding, Hiking..." onSuggest={fetchSuggestions} onPolish={handlePolish} loadingState={loadingState} />
                    </div>
                )}

                {step > 0 && steps[step].field !== 'preview' && steps[step].field !== 'details' && (
                  <TextAreaField 
                    label={steps[step].label} fieldName={steps[step].field} value={resume[steps[step].field]}
                    onChange={(e) => updateField(steps[step].field, e.target.value)}
                    placeholder={`Enter ${steps[step].label} details...`}
                    onSuggest={fetchSuggestions} onPolish={handlePolish} loadingState={loadingState}
                  />
                )}

                {step === steps.length - 1 && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <div className="bg-[#DFD6AE]/10 p-8 rounded-3xl border border-[#DFD6AE]/20 max-w-sm">
                      <Check className="w-12 h-12 text-[#DFD6AE] mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Resume Finalized</h3>
                      <p className="text-white/50 text-xs mb-6 leading-relaxed">Preview your work on the right. Empty sections are automatically removed.</p>
                      <button onClick={exportPDF} className="w-full py-4 bg-[#DFD6AE] text-[#1a2630] font-bold rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                        <Download size={20} /> Download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-between pt-6 border-t border-white/5 shrink-0">
                <button onClick={prevStep} disabled={step === 0} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all"><ChevronLeft /></button>
                <div className="flex gap-1 items-center">
                  {steps.map((_, i) => <div key={i} className={`h-1 w-3 rounded-full transition-all ${i === step ? 'bg-[#DFD6AE] w-6' : 'bg-white/10'}`} />)}
                </div>
                <button onClick={nextStep} disabled={step === steps.length - 1} className="p-2 rounded-lg bg-[#DFD6AE] text-[#1a2630] disabled:opacity-20 transition-all"><ChevronRight /></button>
              </div>
            </div>
          </div>

          {/* RIGHT: SIDEBAR */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
            
            {/* AI ASSISTANT BOX */}
            <div className="bg-[#243441] rounded-3xl p-6 border border-[#DFD6AE]/20 shadow-lg flex flex-col h-1/2 min-h-0">
               <div className="flex items-center gap-3 mb-4 shrink-0">
                <div className="w-8 h-8 bg-[#DFD6AE]/10 rounded-lg flex items-center justify-center text-[#DFD6AE]">
                  {loadingState.type ? <Loader2 size={16} className="animate-spin" /> : <Bot size={16} />}
                </div>
                <h3 className="font-bold text-white text-xs uppercase tracking-widest">AI Assistant</h3>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {critique && (
                   <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-[10px] font-bold text-red-400 mb-1 tracking-tighter uppercase">ATS Score: {analysisScore}%</p>
                    <p className="text-xs text-red-100 leading-relaxed italic">"{critique.headline}"</p>
                   </div>
                )}

                {suggestions.length > 0 ? suggestions.map((s, i) => (
                  <div key={i} onClick={() => applySuggestion(s)} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#DFD6AE]/40 cursor-pointer transition-all text-xs text-gray-400 leading-relaxed">
                    {s}
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 text-center py-10">
                    <Sparkles size={32} className="mb-2" />
                    <p className="text-[10px]">Ideas will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* LIVE PREVIEW BOX */}
            <div className="bg-white rounded-3xl h-1/2 min-h-0 overflow-hidden relative shadow-2xl border-4 border-[#243441]">
               <div className="absolute inset-0 overflow-auto custom-scrollbar bg-gray-200 p-4">
                  <div ref={printRef} className="origin-top transform scale-[0.45] w-[210mm] min-h-[297mm] bg-white text-[#333] p-[12mm] shadow-sm mx-auto">
                    <h1 style={{fontSize: '32px', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', marginBottom: '5px'}}>{resume.name || 'YOUR NAME'}</h1>
                    <div style={{fontSize: '10px', color: '#666', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px'}}>
                        {[resume.location, resume.email, resume.phone, resume.linkedin].filter(Boolean).join(' | ')}
                    </div>

                    <div style={{display: 'table', width: '100%', tableLayout: 'fixed'}}>
                        <div style={{display: 'table-cell', width: '70%', paddingRight: '20px', borderRight: '1px solid #eee', verticalAlign: 'top'}}>
                          {['Summary', 'Skills', 'Experience', 'Projects', 'Training', 'Education'].map(sec => {
                            const content = resume[sec.toLowerCase()];
                            if (!content || content.trim() === '') return null;
                            return (
                              <div key={sec} style={{marginBottom: '15px'}}>
                                 <h2 style={{fontSize: '14px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '3px', marginBottom: '8px'}}>{sec}</h2>
                                 <div style={{fontSize: '10.5px', lineHeight: '1.5', whiteSpace: 'pre-wrap'}}>{content}</div>
                              </div>
                            )
                          })}
                        </div>
                        <div style={{display: 'table-cell', width: '30%', paddingLeft: '20px', verticalAlign: 'top'}}>
                          {['Languages', 'Hobbies'].map(sec => {
                            const content = resume[sec.toLowerCase()];
                            if (!content || content.trim() === '') return null;
                            return (
                              <div key={sec} style={{marginBottom: '15px'}}>
                                 <h2 style={{fontSize: '14px', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '3px', marginBottom: '8px'}}>{sec}</h2>
                                 <div style={{fontSize: '10.5px', lineHeight: '1.5', whiteSpace: 'pre-wrap'}}>{content}</div>
                              </div>
                            )
                          })}
                        </div>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;