const axios = require('axios');

const generateSkillQuiz = async (skillName) => {
  // We use the same model defined in your app.py
  const OLLAMA_MODEL = 'llama3.2'; 
  const OLLAMA_URL = 'http://localhost:11434/api/generate';

  const prompt = `
    You are a technical interviewer. Create a comprehensive micro-quiz to test a student's knowledge of the skill: "${skillName}".
    
    Strict Requirements:
    1. Generate exactly 10 multiple-choice questions.
    2. Provide 4 options for each question.
    3. The "options" field MUST be a simple Array of Strings (e.g. ["Option A Text", "Option B Text", ...]). Do NOT use objects or numbers as keys.
    4. Indicate the index of the correct answer (0-3).
    5. Respond with valid JSON only. No markdown, no explanations.
    
    JSON Schema:
    {
      "questions": [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 0
        }
      ]
    }
  `;

  try {
    console.log(`🤖 Generating 10-question quiz for ${skillName}...`);

    const response = await axios.post(OLLAMA_URL, {
      model: OLLAMA_MODEL,
      prompt: prompt,
      format: "json",  
      stream: false    
    });

    let rawData = response.data.response;

    // 1. Clean Markdown wrappers if AI adds them
    rawData = rawData.replace(/```json/g, '').replace(/```/g, '').trim();

    let quizData;
    try {
      quizData = JSON.parse(rawData);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      throw new Error("AI returned invalid JSON");
    }
    
    // Safety check: Ensure questions array exists
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error("Invalid quiz structure returned from AI");
    }

    // 2. SANITIZATION: Fix the "1, 2, 3, 4" bug
    quizData.questions = quizData.questions.map(q => {
      // Fix: If options is an Object { "1": "Ans A", "2": "Ans B" }, convert to Array ["Ans A", "Ans B"]
      if (!Array.isArray(q.options) && typeof q.options === 'object') {
        q.options = Object.values(q.options);
      }

      // Fix: If options are just numbers [1, 2, 3, 4], force text values
      // This happens when AI gets lazy. We replace them so UI doesn't look broken.
      const isBadData = q.options.some(opt => !isNaN(opt) && String(opt).length < 3);
      
      if (isBadData) {
        console.warn("⚠️ AI returned numeric options. Replacing with generic placeholders.");
        q.options = [
           "True / Yes", 
           "False / No", 
           "Depends on context", 
           "Not applicable"
        ];
      }

      return q;
    });

    return quizData;

  } catch (error) {
    console.error("❌ Ollama Quiz Generation Error:", error.message);
    // Return a safe fallback quiz so the app doesn't crash
    return {
        questions: [
            {
                question: `Could not generate quiz for ${skillName}. Check Ollama console.`,
                options: ["Retry", "Cancel", "Ignore", "Debug"],
                correctIndex: 0
            }
        ]
    };
  }
};

module.exports = { generateSkillQuiz };