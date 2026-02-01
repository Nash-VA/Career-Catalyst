from flask import Flask, request, jsonify, session
from flask_cors import CORS
import requests
import json
import urllib.parse
import hashlib
import time
import uuid
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-in-production'  # Change this in production
CORS(app, supports_credentials=True)

# Ollama API configuration
OLLAMA_API_URL = 'http://localhost:11434/api/generate'
OLLAMA_MODEL = 'llama3.2'

# ✅ ENHANCED CACHING SYSTEM
cache = {}
CACHE_DURATION = 15 * 60  # 15 minutes

# ✅ SESSION-BASED INTERVIEW QUESTIONS STORAGE
interview_sessions = {}
SESSION_CLEANUP_INTERVAL = 3600  # 1 hour

def get_cache_key(endpoint, data):
    """Generate unique cache key from endpoint and data"""
    data_str = json.dumps(data, sort_keys=True)
    return hashlib.md5(f"{endpoint}:{data_str}".encode()).hexdigest()

def get_cached_response(cache_key):
    """Get cached response if still valid"""
    if cache_key in cache:
        cached_data, timestamp = cache[cache_key]
        if time.time() - timestamp < CACHE_DURATION:
            print(f"✅ Cache HIT for {cache_key[:8]}...")
            return cached_data
        else:
            print(f"⏰ Cache EXPIRED for {cache_key[:8]}...")
            del cache[cache_key]
    return None

def set_cached_response(cache_key, data):
    """Store response in cache"""
    cache[cache_key] = (data, time.time())
    print(f"💾 Cached response for {cache_key[:8]}...")

def cleanup_old_sessions():
    """Remove expired interview sessions"""
    current_time = time.time()
    expired_sessions = [
        sid for sid, data in interview_sessions.items()
        if current_time - data.get('timestamp', 0) > SESSION_CLEANUP_INTERVAL
    ]
    for sid in expired_sessions:
        del interview_sessions[sid]
        print(f"🗑️ Cleaned up expired session {sid[:8]}...")

def error_handler(f):
    """Decorator for consistent error handling"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except requests.exceptions.Timeout:
            print(f"❌ Timeout in {f.__name__}")
            return jsonify({
                'success': False,
                'message': 'Request timeout. Please try again.',
                'error_type': 'timeout'
            }), 504
        except requests.exceptions.ConnectionError:
            print(f"❌ Connection error in {f.__name__}")
            return jsonify({
                'success': False,
                'message': 'Cannot connect to AI service. Please ensure Ollama is running.',
                'error_type': 'connection'
            }), 503
        except Exception as e:
            print(f"❌ Error in {f.__name__}: {str(e)}")
            return jsonify({
                'success': False,
                'message': 'An unexpected error occurred.',
                'error_type': 'server_error'
            }), 500
    return decorated_function

# ============================================================
# HELPER FUNCTIONS
# ============================================================
def generate_precise_course_url(platform, title, skill):
    """Generate more precise course URLs"""
    search_term = urllib.parse.quote(f"{title} {skill}")

    urls = {
        'Udemy': f"https://www.udemy.com/courses/search/?q={search_term}&sort=relevance",
        'Coursera': f"https://www.coursera.org/search?query={search_term}",
        'Pluralsight': f"https://www.pluralsight.com/search?q={search_term}",
        'LinkedIn Learning': f"https://www.linkedin.com/learning/search?keywords={search_term}",
        'edX': f"https://www.edx.org/search?q={search_term}",
        'Udacity': f"https://www.udacity.com/courses/all?search={search_term}",
        'freeCodeCamp': 'https://www.freecodecamp.org/learn',
        'Codecademy': f"https://www.codecademy.com/search?query={search_term}"
    }

    return urls.get(platform, f"https://www.google.com/search?q={search_term}+course")

def call_ollama_api(prompt, temperature=0.85, num_predict=250, format_json=False, timeout=30):
    """Centralized Ollama API call with error handling"""
    try:
        payload = {
            'model': OLLAMA_MODEL,
            'prompt': prompt,
            'stream': False,
            'options': {
                'temperature': temperature,
                'top_p': 0.95,
                'num_predict': num_predict
            }
        }

        if format_json:
            payload['format'] = 'json'

        response = requests.post(OLLAMA_API_URL, json=payload, timeout=timeout)

        if response.status_code == 200:
            return response.json().get('response', '').strip()
        else:
            print(f"❌ Ollama API returned status {response.status_code}")
            return None

    except Exception as e:
        print(f"❌ Ollama API call failed: {str(e)}")
        return None

# ============================================================
# ENHANCED SKILL GAP ANALYSIS (ENTERPRISE-LEVEL)
# ============================================================
@app.route('/api/skill-analysis', methods=['POST'])
@error_handler
def skill_analysis():
    """Analyze skill gaps with highly personalized insights"""
    data = request.json
    current_skills = data.get('current_skills', [])
    required_skills = data.get('required_skills', [])
    career_title = data.get('career_title', '')
    user_name = data.get('user_name', 'there')

    if not career_title or not required_skills:
        return jsonify({
            'success': False,
            'message': 'Career title and required skills are mandatory'
        }), 400

    # Check cache
    cache_key = get_cache_key('skill-analysis', {
        'career': career_title,
        'current': sorted(current_skills),
        'required': sorted(required_skills),
        'user': user_name
    })

    cached = get_cached_response(cache_key)
    if cached:
        print(f"✅ Returning cached analysis for {career_title}")
        return jsonify(cached)

    skill_gaps = [skill for skill in required_skills if skill not in current_skills]
    completion_rate = round((len(current_skills) / len(required_skills) * 100)) if required_skills else 0

    # ✅ ENTERPRISE-LEVEL PERSONALIZED PROMPT
    prompt = f"""You're an experienced {career_title} senior giving personalized career mentorship to {user_name}.

**{user_name}'s Current Situation:**
- Skills mastered: {', '.join(current_skills[:8]) if current_skills else 'just beginning the journey'}
- Target role: {career_title}
- Skills needed: {', '.join(required_skills[:8])}
- Missing skills: {', '.join(skill_gaps[:6]) if skill_gaps else 'ready for interviews'}
- Progress: {completion_rate}% complete

**Your Task:**
Write 2-4 natural, mentor-like sentences that:
1. Acknowledge their SPECIFIC progress using exact skill names
2. Identify the ONE most critical skill to learn next and explain WHY it matters
3. Give honest timeline expectations (weeks/months)
4. Provide actionable next steps

**Tone Requirements:**
- Address them as {user_name}
- Write like you're having coffee with a mentee
- Be SPECIFIC - mention actual skills from their profile
- Be honest but encouraging
- NO generic phrases like "great progress" or "keep learning"
- NO bullet points or formal structure

**Example Response Style:**
"{user_name}, you've already nailed {current_skills[0] if current_skills else 'the fundamentals'} which is honestly the hardest part for most people entering {career_title}. Now you need to focus on {skill_gaps[0] if skill_gaps else 'interview preparation'} - every job posting I see lists this as a requirement. Give yourself 8-10 weeks of hands-on projects, and you'll be competitive for entry-level roles. The key is building something real, not just watching tutorials."

Write your personalized response now (2-4 sentences):"""

    print(f"\n📊 ANALYZING SKILLS | User: {user_name} | Career: {career_title} | Progress: {completion_rate}%")

    analysis_text = call_ollama_api(prompt, temperature=0.90, num_predict=300)

    # Validate response quality
    if analysis_text and len(analysis_text) > 50:
        generic_phrases = ['great progress', 'keep learning', 'on the right track', 'doing well']
        is_generic = any(phrase in analysis_text.lower() for phrase in generic_phrases)

        if is_generic or len(analysis_text) < 80:
            print(f"⚠️ Generic response detected, using enhanced fallback")
            analysis_text = generate_enhanced_skill_analysis(
                user_name, career_title, current_skills, skill_gaps, completion_rate
            )
    else:
        analysis_text = generate_enhanced_skill_analysis(
            user_name, career_title, current_skills, skill_gaps, completion_rate
        )

    response_data = {
        'success': True,
        'analysis': analysis_text,
        'completion_rate': completion_rate,
        'skills_to_learn': len(skill_gaps),
        'next_priority': skill_gaps[0] if skill_gaps else 'Interview preparation'
    }

    set_cached_response(cache_key, response_data)
    print(f"✅ ANALYSIS GENERATED | {analysis_text[:80]}...")

    return jsonify(response_data)

def generate_enhanced_skill_analysis(user_name, career_title, current_skills, skill_gaps, completion_rate):
    """Generate high-quality personalized fallback analysis"""

    if not current_skills:
        return f"{user_name}, you're at the starting line for {career_title}, which means you get to build the right foundation from day one. Start with {skill_gaps[0] if skill_gaps else 'the fundamentals'} - it's what everything else builds on. Give yourself 10-12 weeks of consistent practice, focusing on building real projects instead of just following tutorials. Once you have this down solid, the rest of the stack will click into place much faster."

    if completion_rate >= 80:
        next_skill = skill_gaps[0] if skill_gaps else 'system design and architecture'
        return f"{user_name}, you're in excellent shape with {', '.join(current_skills[:3])} under your belt. To be truly interview-ready for {career_title} roles, add {next_skill} to your toolkit - it's what separates good candidates from great ones. Dedicate 4-6 weeks to building production-level projects with this technology. After that, start applying actively because you'll have everything companies are looking for."

    if completion_rate >= 50:
        first_skills = ', '.join(current_skills[:2]) if len(current_skills) >= 2 else current_skills[0]
        next_skill = skill_gaps[0] if skill_gaps else 'advanced frameworks'
        return f"{user_name}, having {first_skills} is solid progress - you're halfway to being job-ready for {career_title}. Your next focus should be {next_skill} because it pairs directly with what you know and shows up in 80% of job descriptions. Plan for 10-12 weeks of hands-on learning with real-world projects. Once you nail this, you'll be competitive for most entry-level positions in your target market."

    # Less than 50%
    first_skill = current_skills[0] if current_skills else 'the basics'
    next_skill = skill_gaps[0] if skill_gaps else 'core technologies'
    second_skill = skill_gaps[1] if len(skill_gaps) > 1 else 'related frameworks'
    return f"{user_name}, {first_skill} is a strong foundation to build on for {career_title}. Now prioritize {next_skill} - it's arguably the most important skill after what you already have. Give yourself 12-14 weeks with intensive project work. After that, {second_skill} will be much easier to pick up, and you'll start seeing real momentum in your learning journey."

# ============================================================
# ENHANCED LEARNING ROADMAP (ENTERPRISE-LEVEL)
# ============================================================
@app.route('/api/learning-roadmap', methods=['POST'])
@error_handler
def generate_learning_roadmap():
    """Generate highly personalized learning roadmap"""
    data = request.json
    career_title = data.get('career_title')
    current_skills = data.get('current_skills', [])[:5]
    skill_gaps = data.get('skill_gaps', [])[:6]
    required_skills = data.get('required_skills', [])[:6]
    user_name = data.get('user_name', 'there')

    if not career_title:
        return jsonify({
            'success': False,
            'message': 'Career title is required'
        }), 400

    # Check cache
    cache_key = get_cache_key('learning-roadmap', {
        'career': career_title,
        'current': sorted(current_skills),
        'gaps': sorted(skill_gaps),
        'user': user_name
    })

    cached = get_cached_response(cache_key)
    if cached:
        return jsonify(cached)

    prompt = f"""Create a personalized 4-phase learning roadmap for {user_name} who wants to become a {career_title}.

**{user_name}'s Background:**
- Current skills: {', '.join(current_skills) if current_skills else 'complete beginner'}
- Needs to learn: {', '.join(skill_gaps) if skill_gaps else 'all fundamentals'}
- Target skills: {', '.join(required_skills) if required_skills else 'industry standards'}

**Instructions:**
Create 4 progressive phases: Foundation → Core → Advanced → Professional

For EACH phase provide:
1. Natural, mentor-style description (NOT corporate jargon)
2. Specific skills to master
3. Clear learning objectives
4. Realistic resources

**Description Guidelines:**
- Write like texting career advice to {user_name}
- Be SPECIFIC about what they'll actually build/learn
- Reference their current level
- NO generic phrases like "Master fundamentals" or "Learn core concepts"
- Use natural language: "You'll spend these first 3 months getting comfortable with..."

**Response Format (pure JSON, no markdown):**
{{
  "overview": "2-3 personalized sentences about {user_name}'s learning journey, referencing their current skills if any.",
  "total_duration": "10-14 months",
  "phases": [
    {{
      "phase_number": 1,
      "title": "Foundation Skills",
      "duration": "2-3 months",
      "status": "in-progress",
      "skills": ["skill1", "skill2", "skill3"],
      "description": "Natural explanation of what {user_name} will learn and build in this phase. Must be conversational and specific - minimum 2 sentences.",
      "learning_objectives": ["Specific objective 1", "Specific objective 2", "Specific objective 3"],
      "resources": ["Resource type 1", "Resource type 2"]
    }},
    {{
      "phase_number": 2,
      "title": "Core Technologies",
      "duration": "3-4 months",
      "status": "upcoming",
      "skills": ["skill4", "skill5"],
      "description": "What {user_name} will build in phase 2, different from phase 1.",
      "learning_objectives": ["objective1", "objective2"],
      "resources": ["Courses", "Projects"]
    }},
    {{
      "phase_number": 3,
      "title": "Advanced Concepts",
      "duration": "3-4 months",
      "status": "upcoming",
      "skills": ["skill6", "skill7"],
      "description": "Advanced skills {user_name} will develop.",
      "learning_objectives": ["objective1", "objective2"],
      "resources": ["Advanced resources"]
    }},
    {{
      "phase_number": 4,
      "title": "Professional Practice",
      "duration": "2-3 months",
      "status": "upcoming",
      "skills": ["Portfolio", "Networking", "Interviews"],
      "description": "How {user_name} will transition to landing a job.",
      "learning_objectives": ["Build portfolio", "Network", "Interview prep"],
      "resources": ["GitHub", "LinkedIn", "Mock interviews"]
    }}
  ]
}}"""

    print(f"\n🗺️ GENERATING ROADMAP | User: {user_name} | Career: {career_title}")

    response_text = call_ollama_api(prompt, temperature=0.90, num_predict=1500, format_json=True, timeout=60)

    if response_text:
        try:
            roadmap_data = json.loads(response_text)

            # Validate and enhance descriptions
            for phase in roadmap_data.get('phases', []):
                desc = phase.get('description', '')
                if len(desc) < 60:
                    skills_list = ', '.join(phase.get('skills', [])[:3])
                    phase['description'] = f"In this phase, {user_name} will focus on {skills_list}. You'll build practical projects and gain hands-on experience through real-world applications that demonstrate your growing expertise."

            # Set intelligent status based on current skills
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

            response_data = {
                'success': True,
                'roadmap': roadmap_data
            }

            set_cached_response(cache_key, response_data)
            print(f"✅ ROADMAP GENERATED | Phases: {len(roadmap_data.get('phases', []))}")

            return jsonify(response_data)

        except json.JSONDecodeError as e:
            print(f"❌ JSON parsing failed: {e}")
            return jsonify({
                'success': False,
                'message': 'Failed to generate roadmap. Please try again.'
            }), 500
    else:
        return jsonify({
            'success': False,
            'message': 'AI service unavailable'
        }), 503

# ============================================================
# ENHANCED COURSE RECOMMENDATIONS (ENTERPRISE-LEVEL)
# ============================================================
@app.route('/api/course-recommendations', methods=['POST'])
@error_handler
def get_course_recommendations():
    """Generate highly personalized course recommendations"""
    data = request.json
    skill_gaps = data.get('skill_gaps', [])
    career_title = data.get('career_title', '')
    required_skills = data.get('required_skills', [])
    user_name = data.get('user_name', 'there')

    if not skill_gaps and not required_skills:
        return jsonify({
            'success': False,
            'message': 'Skills information required'
        }), 400

    skills_to_search = skill_gaps if skill_gaps else required_skills[:5]
    skills_to_search = skills_to_search[:3]

    # Check cache
    cache_key = get_cache_key('course-recommendations', {
        'career': career_title,
        'skills': sorted(skills_to_search),
        'user': user_name
    })

    cached = get_cached_response(cache_key)
    if cached:
        print(f"✅ Returning cached courses for {career_title}")
        return jsonify(cached)

    prompt = f"""You're recommending the BEST real online courses for {user_name} who's learning {career_title}.

**Skills {user_name} needs:**
{', '.join(skills_to_search)}

**Your Task:**
Recommend ONE specific REAL course per skill from these platforms:
- Udemy: ₹455-₹3,499 (use ₹455 for popular courses)
- Coursera: ₹3,500-₹8,000/month
- Pluralsight: ₹2,500-₹4,000/month
- LinkedIn Learning: ₹1,650/month
- edX: Free to ₹8,000
- freeCodeCamp: Free
- Udacity: ₹6,999-₹9,999

**CRITICAL RULES:**
1. Use REAL course titles that actually exist
2. Prices in Indian Rupees (₹) ONLY
3. Realistic durations (10-50 hours typically)
4. Natural descriptions (not marketing copy)
5. Beginner to intermediate level

**Course Title Patterns:**
- Udemy: "The Complete [Tech] Bootcamp", "[Tech] for Beginners 2024"
- Coursera: "[University] - [Tech] Specialization"
- freeCodeCamp: "[Tech] Certification"

**Response Format (pure JSON):**
{{
  "courses": [
    {{
      "title": "Actual real course title",
      "platform": "Udemy",
      "duration": "40 hours",
      "level": "Beginner",
      "skills": ["Python"],
      "description": "Natural description of what {user_name} will learn - be specific and helpful, not salesy",
      "rating": "4.7",
      "price": "₹455"
    }}
  ]
}}

Generate {len(skills_to_search)} courses now (one per skill):"""

    print(f"\n📚 GENERATING COURSES | User: {user_name} | Skills: {len(skills_to_search)}")

    response_text = call_ollama_api(prompt, temperature=0.75, num_predict=600, format_json=True, timeout=60)

    if response_text:
        try:
            courses_data = json.loads(response_text)
            courses = courses_data.get('courses', [])

            validated_courses = []
            for course in courses:
                try:
                    platform = course.get('platform', 'Udemy')
                    title = course.get('title', '')
                    skills = course.get('skills', [])
                    skill = skills[0] if skills else career_title

                    course['url'] = generate_precise_course_url(platform, title, skill)

                    # Fix pricing
                    price = str(course.get('price', ''))
                    if '$' in price:
                        if platform == 'Udemy':
                            course['price'] = '₹455'
                        elif platform == 'Coursera':
                            course['price'] = '₹5,499/month'
                        elif platform == 'freeCodeCamp':
                            course['price'] = 'Free'
                        else:
                            course['price'] = '₹2,999'
                    elif '₹' not in price and price.lower() != 'free':
                        course['price'] = '₹455'

                    # Validate price reasonableness
                    if '₹' in course['price']:
                        price_num = ''.join(filter(str.isdigit, course['price']))
                        if price_num and int(price_num) > 15000:
                            course['price'] = '₹455'

                    # Validate rating
                    try:
                        rating = float(course.get('rating', '4.5'))
                        if rating > 5.0 or rating < 3.0:
                            course['rating'] = '4.5'
                    except:
                        course['rating'] = '4.5'

                    validated_courses.append(course)
                    print(f"✅ Course: {title[:50]} | {platform} | {course['price']}")

                except Exception as course_error:
                    print(f"⚠️ Error validating course: {course_error}")
                    continue

            if not validated_courses:
                print("⚠️ No valid courses, using enhanced fallback")
                validated_courses = generate_enhanced_course_fallback(career_title, skills_to_search)

            response_data = {
                'success': True,
                'courses': validated_courses
            }

            set_cached_response(cache_key, response_data)
            print(f"✅ COURSES GENERATED | Count: {len(validated_courses)}")

            return jsonify(response_data)

        except json.JSONDecodeError:
            fallback_courses = generate_enhanced_course_fallback(career_title, skills_to_search)
            return jsonify({
                'success': True,
                'courses': fallback_courses
            })
    else:
        fallback_courses = generate_enhanced_course_fallback(career_title, skills_to_search)
        return jsonify({
            'success': True,
            'courses': fallback_courses
        })

def generate_enhanced_course_fallback(career_title, skills):
    """High-quality course fallback with real course data"""
    course_templates = {
        'Docker': {
            'title': 'Docker and Kubernetes: The Complete Guide',
            'platform': 'Udemy',
            'duration': '22 hours',
            'level': 'Beginner',
            'description': 'Build, test, and deploy Docker applications with Kubernetes. Master containerization through hands-on projects and real-world scenarios.',
            'rating': '4.7',
            'price': '₹455'
        },
        'Kubernetes': {
            'title': 'Kubernetes for Beginners',
            'platform': 'Udemy',
            'duration': '18 hours',
            'level': 'Beginner',
            'description': 'Master Kubernetes orchestration, deployments, and cluster management. Learn through practical examples and production scenarios.',
            'rating': '4.6',
            'price': '₹455'
        },
        'Python': {
            'title': '100 Days of Code: The Complete Python Pro Bootcamp',
            'platform': 'Udemy',
            'duration': '54 hours',
            'level': 'Beginner',
            'description': 'Learn Python from basics to advanced. Build 100 projects including web applications, data science tools, and automation scripts.',
            'rating': '4.8',
            'price': '₹455'
        },
        'React': {
            'title': 'React - The Complete Guide 2024',
            'platform': 'Udemy',
            'duration': '48 hours',
            'level': 'Beginner',
            'description': 'Master React with hooks, components, routing, Redux, and modern React patterns. Build real-world production applications.',
            'rating': '4.7',
            'price': '₹455'
        },
        'Node.js': {
            'title': 'The Complete Node.js Developer Course',
            'platform': 'Udemy',
            'duration': '35 hours',
            'level': 'Beginner',
            'description': 'Build scalable Node.js applications with Express, MongoDB, and modern JavaScript. Deploy real-world projects to production.',
            'rating': '4.7',
            'price': '₹455'
        },
        'JavaScript': {
            'title': 'The Complete JavaScript Course 2024',
            'platform': 'Udemy',
            'duration': '69 hours',
            'level': 'Beginner',
            'description': 'Modern JavaScript from scratch - ES6+, async programming, OOP, functional programming, and real projects.',
            'rating': '4.8',
            'price': '₹455'
        },
        'SQL': {
            'title': 'The Complete SQL Bootcamp',
            'platform': 'Udemy',
            'duration': '9 hours',
            'level': 'Beginner',
            'description': 'Master SQL queries, database design, joins, and real-world data analysis. Learn PostgreSQL and MySQL.',
            'rating': '4.6',
            'price': '₹455'
        },
        'MongoDB': {
            'title': 'MongoDB - The Complete Developer Guide',
            'platform': 'Udemy',
            'duration': '17 hours',
            'level': 'Beginner',
            'description': 'Learn MongoDB database design, CRUD operations, aggregation framework, and integration with Node.js applications.',
            'rating': '4.6',
            'price': '₹455'
        },
        'Git': {
            'title': 'Git Complete: The Definitive Guide',
            'platform': 'Udemy',
            'duration': '6 hours',
            'level': 'Beginner',
            'description': 'Master Git version control, branching strategies, collaboration workflows, and GitHub. Essential for all developers.',
            'rating': '4.7',
            'price': '₹455'
        },
        'AWS': {
            'title': 'AWS Certified Solutions Architect',
            'platform': 'Udemy',
            'duration': '27 hours',
            'level': 'Intermediate',
            'description': 'Master AWS services including EC2, S3, RDS, Lambda, and more. Build cloud infrastructure and prepare for certification.',
            'rating': '4.7',
            'price': '₹455'
        }
    }

    courses = []
    for skill in skills[:3]:
        skill_key = skill.strip()
        if skill_key in course_templates:
            course = course_templates[skill_key].copy()
            course['skills'] = [skill_key]
            course['url'] = generate_precise_course_url(course['platform'], course['title'], skill_key)
            courses.append(course)
        else:
            courses.append({
                'title': f'Complete {skill} Course for Beginners',
                'platform': 'Udemy',
                'duration': '20 hours',
                'level': 'Beginner',
                'skills': [skill],
                'description': f'Learn {skill} from fundamentals to advanced concepts. Build real projects and gain practical experience for {career_title} roles.',
                'rating': '4.5',
                'price': '₹455',
                'url': generate_precise_course_url('Udemy', f'{skill} Complete Course', skill)
            })

    return courses[:3]

# ============================================================
# ENHANCED COURSE INSIGHTS (ENTERPRISE-LEVEL)
# ============================================================
@app.route('/api/course-insights', methods=['POST'])
@error_handler
def get_course_insights():
    """Generate personalized learning insights"""
    data = request.json
    career_title = data.get('career_title')
    skill_gaps = data.get('skill_gaps', [])
    current_skills = data.get('current_skills', [])
    user_name = data.get('user_name', 'there')

    if not career_title or not skill_gaps:
        return jsonify({
            'success': False,
            'error': 'Missing required fields'
        }), 400

    # Check cache
    cache_key = get_cache_key('course-insights', {
        'career': career_title,
        'gaps': sorted(skill_gaps[:4]),
        'current': sorted(current_skills[:5]),
        'user': user_name
    })

    cached = get_cached_response(cache_key)
    if cached:
        return jsonify(cached)

    current_skills_str = ', '.join(current_skills) if current_skills else 'just starting out'
    skill_gaps_str = ', '.join(skill_gaps[:4])

    prompt = f"""You're a senior {career_title} mentor advising {user_name} on their learning path.

**{user_name}'s Current State:**
- Skills they have: {current_skills_str}
- Skills they need: {skill_gaps_str}
- Goal: Become a {career_title}

**Your Task:**
Give {user_name} practical, honest advice in 2-3 short paragraphs (100-120 words total):

1. Which ONE skill to focus on next and WHY it's the priority
2. Realistic timeline (don't sugarcoat - be honest)
3. Best learning approach (courses vs projects vs practice)
4. Brief encouragement with specific tip

**Style:**
- Address {user_name} by name
- Write like you're texting career advice to a friend
- Be SPECIFIC - use actual skill names
- Be honest about timelines
- NO generic phrases like "I recommend" or "you should consider"
- NO asterisks, NO bullet points, NO formal language

Write naturally and conversationally:"""

    print(f"\n💡 GENERATING INSIGHTS | User: {user_name} | Career: {career_title}")

    insights = call_ollama_api(prompt, temperature=0.92, num_predict=200)

    if insights and len(insights) > 50:
        response_data = {
            'success': True,
            'insights': insights,
            'career': career_title
        }

        set_cached_response(cache_key, response_data)
        return jsonify(response_data)
    else:
        # Enhanced fallback
        fallback_skills = skill_gaps[:2] if len(skill_gaps) >= 2 else skill_gaps
        if len(fallback_skills) == 1:
            fallback_message = f"{user_name}, start with {fallback_skills[0]} - it's the cornerstone for everything else in {career_title}. Give yourself 10-12 weeks to get comfortable through building actual projects. Mix structured courses (maybe 30% of your time) with hands-on coding (70%). Practice daily, even if it's just 45 minutes. Once this clicks, you'll find the next skills come way easier. The key is consistency over intensity."
        else:
            fallback_message = f"{user_name}, prioritize {fallback_skills[0]} first - it'll make learning {fallback_skills[1]} significantly easier. Plan for 12-16 weeks total to get solid with both. Start with a good course to understand concepts, then immediately build projects. Don't get stuck in tutorial hell. Real learning happens when you're debugging your own code at midnight. That's when it actually sticks."

        return jsonify({
            'success': True,
            'insights': fallback_message
        })

# ============================================================
# INTERVIEW QUESTIONS WITH SESSION LOCKING (ENTERPRISE-LEVEL)
# ============================================================
@app.route('/api/interview-questions', methods=['POST'])
@error_handler
def generate_interview_questions():
    """Generate personalized interview questions with session locking"""
    cleanup_old_sessions()

    data = request.json
    session_id = data.get('session_id')
    career_title = data.get('career_title', 'Software Developer')
    required_skills = data.get('required_skills', [])
    skill_gaps = data.get('skill_gaps', [])
    user_name = data.get('user_name', 'candidate')

    if not session_id:
        return jsonify({
            'success': False,
            'message': 'Session ID required'
        }), 400

    # ✅ CHECK IF SESSION HAS LOCKED QUESTIONS
    if session_id in interview_sessions:
        session_data = interview_sessions[session_id]
        print(f"✅ Returning locked questions for session {session_id[:8]}...")
        return jsonify({
            'success': True,
            'questions': session_data['questions'],
            'locked': True,
            'session_id': session_id,
            'generated_at': session_data.get('generated_at')
        })

    prompt = f"""You're a senior {career_title} interviewer creating realistic interview questions for {user_name}.

**Role Context:**
- Position: {career_title}
- Key Skills: {', '.join(required_skills[:5]) if required_skills else 'industry-standard skills'}
- Focus Areas: {', '.join(skill_gaps[:3]) if skill_gaps else 'general competencies'}

**Task:**
Generate 10 interview questions:
- 5 BEHAVIORAL (leadership, teamwork, conflict, problem-solving, career motivation)
- 5 TECHNICAL (specific to {career_title} with actual tools/frameworks)

**CRITICAL RULES:**
1. Questions MUST be specific to {career_title} - NOT generic
2. Technical questions reference real tools/scenarios from the field
3. Behavioral questions relate to situations common in {career_title} work
4. Write naturally - like a senior engineer asking
5. NO generic questions like "Tell me about yourself" or "Why this company?"

**Response Format (pure JSON):**
{{
  "questions": [
    {{
      "question": "Specific, role-relevant question?",
      "category": "behavioral"
    }},
    {{
      "question": "Technical question with specific tools?",
      "category": "technical"
    }}
  ]
}}

Generate exactly 10 questions (5 behavioral, 5 technical):"""

    print(f"\n🎤 GENERATING QUESTIONS | User: {user_name} | Career: {career_title} | Session: {session_id[:8]}...")

    response_text = call_ollama_api(prompt, temperature=0.80, num_predict=800, format_json=True, timeout=60)

    if response_text:
        try:
            questions_data = json.loads(response_text)
            questions = questions_data.get('questions', [])

            # Filter out generic questions
            generic_keywords = ['tell me about yourself', 'why are you interested', 'what are your strengths', 
                              'where do you see yourself', 'why should we hire', 'greatest weakness']

            filtered_questions = [
                q for q in questions 
                if not any(keyword in q.get('question', '').lower() for keyword in generic_keywords)
            ]

            # Ensure we have exactly 10 questions
            if len(filtered_questions) < 10:
                fallback_questions = generate_enhanced_interview_fallback(career_title, required_skills)
                filtered_questions.extend(fallback_questions[:10 - len(filtered_questions)])

            filtered_questions = filtered_questions[:10]

            # ✅ LOCK QUESTIONS TO SESSION
            interview_sessions[session_id] = {
                'questions': filtered_questions,
                'timestamp': time.time(),
                'generated_at': datetime.now().isoformat(),
                'career': career_title,
                'user': user_name
            }

            print(f"🔒 LOCKED {len(filtered_questions)} questions to session {session_id[:8]}...")

            return jsonify({
                'success': True,
                'questions': filtered_questions,
                'locked': True,
                'session_id': session_id,
                'generated_at': interview_sessions[session_id]['generated_at']
            })

        except json.JSONDecodeError:
            fallback_questions = generate_enhanced_interview_fallback(career_title, required_skills)

            interview_sessions[session_id] = {
                'questions': fallback_questions,
                'timestamp': time.time(),
                'generated_at': datetime.now().isoformat(),
                'career': career_title
            }

            return jsonify({
                'success': True,
                'questions': fallback_questions,
                'locked': True,
                'session_id': session_id
            })
    else:
        fallback_questions = generate_enhanced_interview_fallback(career_title, required_skills)

        interview_sessions[session_id] = {
            'questions': fallback_questions,
            'timestamp': time.time(),
            'generated_at': datetime.now().isoformat(),
            'career': career_title
        }

        return jsonify({
            'success': True,
            'questions': fallback_questions,
            'locked': True,
            'session_id': session_id
        })

def generate_enhanced_interview_fallback(career_title, required_skills):
    """Generate high-quality fallback interview questions"""

    skill_str = ', '.join(required_skills[:3]) if required_skills else career_title

    behavioral_questions = [
        {
            "question": f"Tell me about a time when you had to learn {required_skills[0] if required_skills else 'a new technology'} quickly for a project. How did you approach it?",
            "category": "behavioral"
        },
        {
            "question": f"Describe a situation where you disagreed with a team member about the technical approach for a {career_title} project. How did you resolve it?",
            "category": "behavioral"
        },
        {
            "question": f"Can you walk me through a challenging bug or issue you faced in a recent project? What was your debugging process?",
            "category": "behavioral"
        },
        {
            "question": f"Tell me about a time when you had to balance technical debt with new feature development. How did you make that decision?",
            "category": "behavioral"
        },
        {
            "question": f"Describe a project where you took ownership beyond your assigned tasks. What motivated you and what was the outcome?",
            "category": "behavioral"
        }
    ]

    technical_base = {
        'Software Developer': [
            {"question": "How do you approach writing clean, maintainable code? Can you give me an example of a design pattern you've used recently?", "category": "technical"},
            {"question": "Explain the difference between synchronous and asynchronous programming. When would you choose one over the other?", "category": "technical"},
            {"question": "Walk me through how you would optimize a slow database query. What tools and techniques would you use?", "category": "technical"},
            {"question": "How do you handle error handling and logging in production applications? Give me a specific example.", "category": "technical"},
            {"question": "Describe your experience with version control. How do you manage merge conflicts and code reviews?", "category": "technical"}
        ],
        'Full Stack Developer': [
            {"question": "How do you ensure security when building a full-stack application? What are the most common vulnerabilities you watch for?", "category": "technical"},
            {"question": "Explain how you would architect a scalable REST API. What considerations do you make for authentication and rate limiting?", "category": "technical"},
            {"question": "Walk me through your process for optimizing frontend performance. What metrics do you track?", "category": "technical"},
            {"question": "How do you manage state in a React application? Compare different approaches you've used.", "category": "technical"},
            {"question": "Describe your database design process. How do you decide between SQL and NoSQL for a project?", "category": "technical"}
        ],
        'DevOps Engineer': [
            {"question": "Explain your approach to setting up a CI/CD pipeline. What tools have you worked with and why?", "category": "technical"},
            {"question": "How do you monitor and troubleshoot production applications? What's your incident response process?", "category": "technical"},
            {"question": "Describe your experience with container orchestration. How do you manage Kubernetes deployments?", "category": "technical"},
            {"question": "Walk me through how you would migrate a monolithic application to microservices. What challenges would you anticipate?", "category": "technical"},
            {"question": "How do you implement infrastructure as code? Compare tools you've used like Terraform vs CloudFormation.", "category": "technical"}
        ],
        'Data Scientist': [
            {"question": "How do you approach feature engineering for a machine learning model? Give me a specific example from your experience.", "category": "technical"},
            {"question": "Explain the bias-variance tradeoff and how you balance it in model development.", "category": "technical"},
            {"question": "Walk me through your process for validating a machine learning model. What metrics do you prioritize?", "category": "technical"},
            {"question": "How do you handle imbalanced datasets? What techniques have you found most effective?", "category": "technical"},
            {"question": "Describe a time you deployed a model to production. What challenges did you face with model monitoring and maintenance?", "category": "technical"}
        ]
    }

    # Get technical questions for career or use default
    technical_questions = technical_base.get(career_title, technical_base['Software Developer'])

    return behavioral_questions + technical_questions

# ============================================================
# CLEAR INTERVIEW SESSION ENDPOINT
# ============================================================
@app.route('/api/clear-interview-session', methods=['POST'])
@error_handler
def clear_interview_session():
    """Clear interview session to allow regeneration"""
    data = request.json
    session_id = data.get('session_id')

    if session_id and session_id in interview_sessions:
        del interview_sessions[session_id]
        print(f"🗑️ Cleared session {session_id[:8]}...")
        return jsonify({
            'success': True,
            'message': 'Session cleared successfully'
        })

    return jsonify({
        'success': True,
        'message': 'No session to clear'
    })

# ============================================================
# INTERVIEW FEEDBACK (NO CACHING - ALWAYS FRESH)
# ============================================================
@app.route('/api/interview-feedback', methods=['POST'])
@error_handler
def generate_interview_feedback():
    """Generate brutally honest interview feedback"""
    data = request.json
    question = data.get('question', '')
    answer = data.get('answer', '')
    career_title = data.get('career_title', 'Software Developer')
    user_name = data.get('user_name', 'candidate')

    if not question or not answer:
        return jsonify({
            'success': False,
            'message': 'Question and answer are required'
        }), 400

    # ✅ NO CACHING - Always generate fresh, unique feedback

    prompt = f"""You're a senior {career_title} interviewer giving HONEST feedback to {user_name} who just answered an interview question.

**Question Asked:**
{question}

**{user_name}'s Answer:**
{answer}

**Your Task:**
Give brutally honest, helpful feedback. Score 0-10 and be TOUGH:

**Scoring Guide:**
- 0-3: Terrible - vague, generic, or completely off-topic
- 4-5: Poor - missing key points, too short, no examples
- 6-7: Decent - hits basics but lacks depth or specifics
- 8-9: Good - solid answer with specific examples
- 10: Excellent - comprehensive, specific, demonstrates real expertise

**Feedback Style:**
- Be DIRECT and HONEST (like a mentor who wants them to improve)
- If answer is vague → Call it out: "This sounds like you copied a textbook"
- If no examples → Demand them: "Where's the real project example?"
- If too short → "You gave me 2 sentences for a senior-level question"
- If actually good → Acknowledge what worked specifically
- Use {user_name}'s name
- NO sugarcoating

**Response Format (pure JSON):**
{{
  "score": 6,
  "strengths": ["One specific thing they did well"],
  "improvements": ["Specific critique 1", "What sounds fake or generic"],
  "detailed_feedback": "2-3 sentences of honest feedback to {user_name}. Be specific about what's missing. If it's good, say why. If it's bad, say exactly what's wrong.",
  "suggestions": "Here's how {user_name} should answer this instead: [give a specific better answer example with real details]"
}}

Generate feedback now:"""

    print(f"\n📝 GENERATING FEEDBACK | User: {user_name} | Question length: {len(question)} | Answer length: {len(answer)}")

    # ✅ NO timeout cache, always fresh
    response_text = call_ollama_api(prompt, temperature=0.88, num_predict=400, format_json=True, timeout=45)

    if response_text:
        try:
            feedback_data = json.loads(response_text)

            # Validate score is realistic
            score = feedback_data.get('score', 5)
            if score > 10:
                feedback_data['score'] = 8
            elif score < 0:
                feedback_data['score'] = 3

            print(f"✅ FEEDBACK GENERATED | Score: {feedback_data.get('score')}/10")

            return jsonify({
                'success': True,
                'feedback': feedback_data
            })

        except json.JSONDecodeError:
            # Enhanced fallback
            answer_length = len(answer.split())
            has_example = any(word in answer.lower() for word in ['project', 'example', 'time when', 'experience', 'worked on'])

            if answer_length < 20:
                score = 4
                detailed_feedback = f"{user_name}, your answer is way too short ({answer_length} words). For interview questions, aim for 150-200 words with specific examples. You need to demonstrate actual experience, not just give textbook definitions."
                suggestions = f"Here's how to improve: Start with a specific project or situation, explain what you did step-by-step, mention the technologies you used, and end with the outcome. For example: 'In my recent project building an e-commerce site, I implemented JWT authentication because...' Give me details."
            elif not has_example:
                score = 5
                detailed_feedback = f"{user_name}, you're giving me theory without real examples. I need to hear about actual projects you've worked on. Generic explanations don't prove you can do the job. Tell me about a REAL situation where you applied this."
                suggestions = "Restructure your answer: 'In [specific project], I faced [specific challenge]. I chose [specific technology/approach] because [reason]. The implementation involved [key steps]. The result was [specific outcome].' Make it real and specific."
            elif answer_length > 200:
                score = 6
                detailed_feedback = f"{user_name}, you're giving me too much information ({answer_length} words). In real interviews, you'll lose the interviewer's attention. Focus on the most important points and be more concise. Quality over quantity."
                suggestions = "Cut your answer to 150-180 words. Keep the strongest example, remove redundant explanations, and get to the point faster. Interviewers appreciate concise, impactful answers."
            else:
                score = 7
                detailed_feedback = f"{user_name}, this is a solid answer. You included specific examples and showed you understand the concept. To make it even stronger, add more technical details about HOW you implemented it and WHAT the specific outcomes were (metrics, performance improvements, etc.)."
                suggestions = "Take this from good to great by adding: 1) Specific technologies/tools you used, 2) Quantifiable results (speed, efficiency, user impact), 3) One challenge you overcame. These details demonstrate real expertise."

            return jsonify({
                'success': True,
                'feedback': {
                    'score': score,
                    'strengths': ['You attempted to answer the question'] if score >= 5 else ['Needs significant improvement'],
                    'improvements': ['Add specific examples', 'Include technical details', 'Discuss outcomes'],
                    'detailed_feedback': detailed_feedback,
                    'suggestions': suggestions
                }
            })
    else:
        return jsonify({
            'success': False,
            'message': 'Unable to generate feedback'
        }), 503

# ============================================================
# RESUME SUGGESTIONS (ENTERPRISE-LEVEL)
# ============================================================
@app.route('/api/resume-suggestions', methods=['POST'])
@error_handler
def generate_resume_suggestions():
    """Generate personalized resume improvement suggestions"""
    data = request.json
    resume_text = data.get('resume_text', '')
    career_title = data.get('career_title', '')
    user_name = data.get('user_name', 'there')

    if not resume_text:
        return jsonify({
            'success': False,
            'message': 'Resume text required'
        }), 400

    # Limit resume text to prevent token overflow
    resume_text = resume_text[:2000]

    prompt = f"""You're a senior recruiter reviewing {user_name}'s resume for {career_title} positions.

**{user_name}'s Resume:**
{resume_text}

**Your Task:**
Give 5-7 specific, actionable suggestions to improve this resume for {career_title} roles.

**Focus On:**
1. Missing technical skills or keywords for {career_title}
2. Weak bullet points that need quantifiable results
3. Generic descriptions that should be more specific
4. Missing sections (projects, certifications, etc.)
5. Format or structure issues

**Style:**
- Address {user_name} directly
- Be SPECIFIC - reference actual content from their resume
- Give ACTIONABLE advice (not just "improve your resume")
- Be honest but encouraging
- Write naturally, like career coaching

**Response Format (pure JSON):**
{{
  "suggestions": [
    "Specific suggestion 1 with reference to their resume content",
    "Specific suggestion 2 with actionable next step",
    "Specific suggestion 3..."
  ]
}}

Generate 5-7 specific suggestions:"""

    print(f"\n📄 GENERATING RESUME SUGGESTIONS | User: {user_name} | Career: {career_title}")

    response_text = call_ollama_api(prompt, temperature=0.85, num_predict=500, format_json=True, timeout=45)

    if response_text:
        try:
            suggestions_data = json.loads(response_text)
            suggestions = suggestions_data.get('suggestions', [])

            if len(suggestions) < 3:
                suggestions = generate_resume_fallback(career_title, user_name)

            return jsonify({
                'success': True,
                'suggestions': suggestions[:7]
            })
        except json.JSONDecodeError:
            suggestions = generate_resume_fallback(career_title, user_name)
            return jsonify({
                'success': True,
                'suggestions': suggestions
            })
    else:
        suggestions = generate_resume_fallback(career_title, user_name)
        return jsonify({
            'success': True,
            'suggestions': suggestions
        })

def generate_resume_fallback(career_title, user_name):
    """Generate fallback resume suggestions"""
    return [
        f"{user_name}, add quantifiable metrics to your bullet points. Instead of 'Developed web applications,' write 'Built 5 React applications serving 10,000+ users with 95% uptime.'",
        f"Include a Projects section showcasing 2-3 relevant {career_title} projects with links to GitHub repos and live demos. Recruiters want to see your actual work.",
        f"List technical skills specific to {career_title} near the top. Include frameworks, tools, and technologies that match job descriptions you're targeting.",
        f"{user_name}, use action verbs at the start of each bullet: 'Implemented,' 'Architected,' 'Optimized,' 'Led' - not 'Responsible for' or 'Worked on.'",
        f"Add certifications or online courses relevant to {career_title}. Even Udemy courses show you're actively learning and staying current.",
        f"Keep your resume to 1 page if you have less than 5 years of experience. Focus on the most impressive, relevant achievements for {career_title} roles."
    ]

# ============================================================
# HEALTH CHECK ENDPOINT
# ============================================================
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'ollama_model': OLLAMA_MODEL,
        'cache_entries': len(cache),
        'active_sessions': len(interview_sessions)
    })

# ============================================================
# RUN SERVER
# ============================================================
if __name__ == '__main__':
    print(f"""
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║        🚀 CAREER CATALYST AI - ENTERPRISE EDITION 🚀         ║
    ║                                                              ║
    ║  Status: Running on http://localhost:5001                   ║
    ║  Model: {OLLAMA_MODEL}                                    ║
    ║  Features: Enhanced Personalization + Session Management    ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    """)

    app.run(debug=True, host='0.0.0.0', port=5001)
