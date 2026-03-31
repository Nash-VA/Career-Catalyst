import pandas as pd
import json
import collections

# Load the CSV
df = pd.read_csv('AI-based Career Recommendation System.csv')

# Helper to split strings separated by semicolons
def split_str(s):
    if pd.isna(s): return []
    return [x.strip() for x in str(s).split(';') if x.strip()]

# Map careers to categories for the UI icons
category_map = {
    'UX Designer': 'Design', 'Graphic Designer': 'Design', 'UX Researcher': 'Design',
    'Project Manager': 'Product Management', 'Marketing Manager': 'Marketing', 'Digital Marketer': 'Marketing',
    'Cybersecurity Analyst': 'Security', 'Cybersecurity Specialist': 'Security',
    'Cloud Engineer': 'Cloud Computing', 'Embedded Systems Engineer': 'Emerging Tech', 'Research Scientist': 'Emerging Tech',
    'Financial Analyst': 'Business', 'Business Analyst': 'Business', 'Research Analyst': 'Business',
    'Content Strategist': 'Content & Writing', 'Automation Engineer': 'Software Testing'
}

careers_list = []
c_id = 1

# Group data by the Recommended Career
for career in df['Recommended_Career'].unique():
    subset = df[df['Recommended_Career'] == career]
    
    # Aggregate and count all skills for this career
    all_skills = []
    for s in subset['Skills']:
        all_skills.extend(split_str(s))
    
    # Get the top 12 most common skills for this specific career
    most_common_skills = [item[0] for item in collections.Counter(all_skills).most_common(12)]
    req_skills = most_common_skills[:6]
    opt_skills = most_common_skills[6:12]
    
    # Aggregate all unique interests
    all_interests = []
    for i in subset['Interests']:
        all_interests.extend(split_str(i))
    interest_keywords = list(set([i.lower() for i in all_interests]))
    
    # Find all education levels associated with this career
    all_edu = subset['Education'].dropna().unique().tolist()
    
    # Build the JSON object
    career_obj = {
        "id": c_id,
        "title": career,
        "category": category_map.get(career, 'Data Science & AI' if 'Data' in career or 'AI' in career else 'Software Development'),
        "required_skills": req_skills,
        "optional_skills": opt_skills,
        "skill_keywords": [s.lower() for s in req_skills + opt_skills],
        "interest_keywords": interest_keywords,
        "education": all_edu,
        "experience_levels": ["Fresher", "0-2 years", "2+ years"],
        "description": f"Professional responsible for {career.lower()} tasks, strategy, and solving industry problems.",
        "average_salary": "₹8,00,000 - ₹20,00,000",
        "demand_level": "High",
        "growth_rate": "20%",
        "match_threshold": 0.4
    }
    
    careers_list.append(career_obj)
    c_id += 1

# Wrap in the "careers" key your app expects
final_json = {"careers": careers_list}

# Save to the backend folder
output_path = 'career_dataset.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_json, f, indent=2)

print(f"✅ Successfully converted CSV to JSON!")
print(f"✅ Generated {len(careers_list)} unique careers.")
print(f"📁 Saved to {output_path}. Please move this file to backend/data/")