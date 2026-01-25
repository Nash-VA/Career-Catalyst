from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

# Ollama API configuration
OLLAMA_API_URL = 'http://localhost:11434/api/generate'
OLLAMA_MODEL = 'llama3.2'

# ============================================================
# CAREER RECOMMENDATION ENDPOINT
# ============================================================
@app.route('/api/recommend-career', methods=['POST'])
def recommend_career():
    """Generate career recommendations using Ollama AI"""
    try:
        data = request.json
        interests = data.get('interests', [])
        skills = data.get('skills', [])
        education = data.get('education', '')
        experience = data.get('experience', '')
        
        prompt = f"""Based on the following profile, recommend the top 3 most suitable career paths:

Interests: {', '.join(interests)}
Skills: {', '.join(skills)}
Education: {education}
Experience Level: {experience}

For each career, provide:
1. Career title
2. Match score (0-100)
3. Brief description (1-2 sentences)
4. 5-7 required skills
5. 3-5 current matching skills from user's profile
6. 3-5 skills they need to learn (skill gaps)
7. Average salary range
8. Job growth outlook

Respond ONLY with valid JSON in this exact format:
{{
  "careers": [
    {{
      "title": "Career Title",
      "matchScore": 85,
      "description": "Brief description",
      "requiredSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
      "currentSkills": ["skill1", "skill2"],
      "skillGap": ["skill3", "skill4", "skill5"],
      "salary": "$XX,000 - $XX,000",
      "growth": "Growth outlook description"
    }}
  ]
}}"""

        ollama_response = requests.post(
            OLLAMA_API_URL,
            json={
                'model': OLLAMA_MODEL,
                'prompt': prompt,
                'stream': False,
                'format': 'json',
                'options': {
                    'temperature': 0.7,
                    'top_p': 0.9
                }
            },
            timeout=60
        )
        
        if ollama_response.status_code == 200:
            ollama_data = ollama_response.json()
            response_text = ollama_data.get('response', '')
            
            try:
                career_data = json.loads(response_text)
                return jsonify({
                    'success': True,
                    'careers': career_data.get('careers', [])
                })
            except json.JSONDecodeError:
                return jsonify({
                    'success': False,
                    'message': 'Failed to parse AI response'
                }), 500
        else:
            return jsonify({
                'success': False,
                'message': 'Ollama API error'
            }), 500
            
    except Exception as e:
        print(f"Career recommendation error: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


# ============================================================
# SKILL GAP ANALYSIS ENDPOINT
# ============================================================
@app.route('/api/skill-analysis', methods=['POST'])
def skill_analysis():
    """Analyze skill gaps and provide insights using Ollama AI"""
    try:
        data = request.json
        current_skills = data.get('current_skills', [])
        required_skills = data.get('required_skills', [])
        career_title = data.get('career_title', '')
        
        skill_gaps = [skill for skill in required_skills if skill not in current_skills]
        completion_rate = round((len(current_skills) / len(required_skills) * 100)) if required_skills else 0
        
        prompt = f"""Analyze the skill profile for someone pursuing a career as {career_title}:

Current Skills: {', '.join(current_skills) if current_skills else 'None'}
Required Skills: {', '.join(required_skills)}
Skills to Learn: {', '.join(skill_gaps) if skill_gaps else 'All skills acquired'}
Completion Rate: {completion_rate}%

Provide a brief (2-3 sentences) analysis of their career readiness, highlighting:
- Their current strengths
- Priority areas for improvement
- Overall readiness assessment

Respond with ONLY a plain text analysis paragraph (no JSON, no formatting).
"""

        ollama_response = requests.post(
            OLLAMA_API_URL,
            json={
                'model': OLLAMA_MODEL,
                'prompt': prompt,
                'stream': False,
                'options': {
                    'temperature': 0.7
                }
            },
            timeout=30
        )
        
        if ollama_response.status_code == 200:
            ollama_data = ollama_response.json()
            analysis_text = ollama_data.get('response', '').strip()
            
            return jsonify({
                'success': True,
                'analysis': analysis_text,
                'completion_rate': completion_rate,
                'skills_to_learn': len(skill_gaps)
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Ollama API error'
            }), 500
            
    except Exception as e:
        print(f"Skill analysis error: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


# ============================================================
# LEARNING ROADMAP ENDPOINT
# ============================================================
@app.route('/api/learning-roadmap', methods=['POST'])
def generate_learning_roadmap():
    """Generate AI-powered learning roadmap using Ollama"""
    try:
        data = request.json
        career_title = data.get('career_title')
        current_skills = data.get('current_skills', [])
        skill_gaps = data.get('skill_gaps', [])
        required_skills = data.get('required_skills', [])
        
        prompt = f"""Generate a detailed learning roadmap for someone who wants to become a {career_title}.

Current Skills: {', '.join(current_skills) if current_skills else 'None'}
Skills to Learn: {', '.join(skill_gaps) if skill_gaps else 'Basic skills'}
All Required Skills: {', '.join(required_skills) if required_skills else 'Industry standard skills'}

Create a 4-phase learning roadmap with the following structure for each phase:
1. Phase title (e.g., "Foundation Skills", "Core Technologies", etc.)
2. Duration (in months, e.g., "2-3 months")
3. 3-5 specific skills to learn in this phase
4. Brief description (1 sentence)
5. 3-4 learning objectives
6. 2-3 recommended resource types

Make it progressive - start with foundations, move to core technologies, then advanced concepts, and finally professional practice.

Respond ONLY with valid JSON in this exact format:
{{
  "overview": "Brief overview of the learning path (2-3 sentences)",
  "total_duration": "10-14 months",
  "phases": [
    {{
      "phase_number": 1,
      "title": "Foundation Skills",
      "duration": "2-3 months",
      "status": "in-progress",
      "skills": ["skill1", "skill2", "skill3"],
      "description": "Master the fundamental concepts and tools",
      "learning_objectives": ["objective1", "objective2", "objective3"],
      "resources": ["Online tutorials", "Documentation"]
    }},
    {{
      "phase_number": 2,
      "title": "Core Technologies",
      "duration": "3-4 months",
      "status": "upcoming",
      "skills": ["skill4", "skill5", "skill6"],
      "description": "Learn essential technologies and frameworks",
      "learning_objectives": ["objective1", "objective2", "objective3"],
      "resources": ["Online courses", "Practice projects"]
    }},
    {{
      "phase_number": 3,
      "title": "Advanced Concepts",
      "duration": "3-4 months",
      "status": "upcoming",
      "skills": ["skill7", "skill8", "skill9"],
      "description": "Dive deep into advanced topics",
      "learning_objectives": ["objective1", "objective2", "objective3"],
      "resources": ["Advanced courses", "Technical blogs"]
    }},
    {{
      "phase_number": 4,
      "title": "Professional Practice",
      "duration": "2-3 months",
      "status": "upcoming",
      "skills": ["Portfolio Projects", "Open Source", "Networking"],
      "description": "Apply knowledge in real-world scenarios",
      "learning_objectives": ["Build portfolio", "Contribute to projects", "Network"],
      "resources": ["GitHub", "LinkedIn", "Hackathons"]
    }}
  ]
}}"""

        ollama_response = requests.post(
            OLLAMA_API_URL,
            json={
                'model': OLLAMA_MODEL,
                'prompt': prompt,
                'stream': False,
                'format': 'json',
                'options': {
                    'temperature': 0.7,
                    'top_p': 0.9
                }
            },
            timeout=60
        )
        
        if ollama_response.status_code == 200:
            ollama_data = ollama_response.json()
            response_text = ollama_data.get('response', '')
            
            try:
                roadmap_data = json.loads(response_text)
                
                # Set status based on current skills
                if roadmap_data.get('phases'):
                    for i, phase in enumerate(roadmap_data['phases']):
                        if i == 0 and len(current_skills) > 0:
                            phase['status'] = 'completed'
                        elif i == 1 and len(current_skills) >= 3:
                            phase['status'] = 'in-progress'
                        elif i == 0 and len(current_skills) == 0:
                            phase['status'] = 'in-progress'
                        else:
                            phase['status'] = 'upcoming'
                
                return jsonify({
                    'success': True,
                    'roadmap': roadmap_data
                })
            except json.JSONDecodeError:
                print("JSON parsing failed")
                return jsonify({
                    'success': False,
                    'message': 'Failed to parse AI response'
                }), 500
        else:
            return jsonify({
                'success': False,
                'message': 'Ollama API error'
            }), 500
            
    except Exception as e:
        print(f"Roadmap generation error: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


# ============================================================
# INTERVIEW QUESTIONS ENDPOINT
# ============================================================
@app.route('/api/interview-questions', methods=['POST'])
def generate_interview_questions():
    """Generate interview questions using Ollama AI"""
    try:
        data = request.json
        career_title = data.get('career_title')
        required_skills = data.get('required_skills', [])
        skill_gaps = data.get('skill_gaps', [])
        
        prompt = f"""Generate interview questions for a {career_title} position.

Required Skills: {', '.join(required_skills[:5]) if required_skills else 'General skills'}
Skill Gaps to Focus On: {', '.join(skill_gaps[:3]) if skill_gaps else 'None'}

Generate 10 interview questions total:
- 5 behavioral/common questions
- 5 technical questions specific to this role

Respond ONLY with valid JSON in this exact format:
{{
  "questions": [
    {{
      "question": "Question text here?",
      "category": "behavioral"
    }},
    {{
      "question": "Technical question text here?",
      "category": "technical"
    }}
  ]
}}"""

        ollama_response = requests.post(
            OLLAMA_API_URL,
            json={
                'model': OLLAMA_MODEL,
                'prompt': prompt,
                'stream': False,
                'format': 'json',
                'options': {
                    'temperature': 0.8,
                    'top_p': 0.9
                }
            },
            timeout=45
        )
        
        if ollama_response.status_code == 200:
            ollama_data = ollama_response.json()
            response_text = ollama_data.get('response', '')
            
            try:
                questions_data = json.loads(response_text)
                return jsonify({
                    'success': True,
                    'questions': questions_data.get('questions', [])
                })
            except json.JSONDecodeError:
                return jsonify({
                    'success': False,
                    'message': 'Failed to parse AI response'
                }), 500
        else:
            return jsonify({
                'success': False,
                'message': 'Ollama API error'
            }), 500
            
    except Exception as e:
        print(f"Interview questions error: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


# ============================================================
# INTERVIEW FEEDBACK ENDPOINT
# ============================================================
@app.route('/api/interview-feedback', methods=['POST'])
def generate_interview_feedback():
    """Generate feedback on interview answers using Ollama AI"""
    try:
        data = request.json
        question = data.get('question')
        answer = data.get('answer')
        career_title = data.get('career_title')
        question_type = data.get('question_type', 'common')
        
        prompt = f"""Evaluate this interview answer for a {career_title} position:

Question: {question}
Answer: {answer}
Question Type: {question_type}

Provide constructive feedback with:
1. Score out of 10
2. 2-3 strengths of the answer
3. 2-3 areas for improvement
4. 1-2 sentences of overall suggestions

Respond ONLY with valid JSON in this exact format:
{{
  "score": 7,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "suggestions": "Overall suggestion text here."
}}"""

        ollama_response = requests.post(
            OLLAMA_API_URL,
            json={
                'model': OLLAMA_MODEL,
                'prompt': prompt,
                'stream': False,
                'format': 'json',
                'options': {
                    'temperature': 0.7
                }
            },
            timeout=30
        )
        
        if ollama_response.status_code == 200:
            ollama_data = ollama_response.json()
            response_text = ollama_data.get('response', '')
            
            try:
                feedback_data = json.loads(response_text)
                return jsonify({
                    'success': True,
                    'feedback': feedback_data
                })
            except json.JSONDecodeError:
                return jsonify({
                    'success': False,
                    'message': 'Failed to parse AI response'
                }), 500
        else:
            return jsonify({
                'success': False,
                'message': 'Ollama API error'
            }), 500
            
    except Exception as e:
        print(f"Interview feedback error: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


# ============================================================
# HEALTH CHECK ENDPOINT
# ============================================================
@app.route('/api/health', methods=['GET'])
def health_check():
    """Check if the API and Ollama are running"""
    try:
        # Test Ollama connection
        ollama_response = requests.get('http://localhost:11434/api/tags', timeout=5)
        ollama_status = ollama_response.status_code == 200
        
        return jsonify({
            'status': 'healthy',
            'ollama_connected': ollama_status,
            'model': OLLAMA_MODEL
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'ollama_connected': False,
            'error': str(e)
        }), 500


# ============================================================
# RUN APPLICATION
# ============================================================
if __name__ == '__main__':
    print("="*60)
    print("🚀 Career Catalyst AI Backend Starting...")
    print("="*60)
    print(f"📍 Server: http://localhost:5001")
    print(f"🤖 Ollama Model: {OLLAMA_MODEL}")
    print(f"🔗 Ollama URL: {OLLAMA_API_URL}")
    print("="*60)
    print("\n✅ Available Endpoints:")
    print("   POST /api/recommend-career")
    print("   POST /api/skill-analysis")
    print("   POST /api/learning-roadmap")
    print("   POST /api/interview-questions")
    print("   POST /api/interview-feedback")
    print("   GET  /api/health")
    print("="*60)
    print("\n⚠️  Make sure Ollama is running: ollama serve")
    print("="*60)
    
    app.run(debug=True, port=5001, host='0.0.0.0')
