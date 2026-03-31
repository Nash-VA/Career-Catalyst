import json
import pickle
import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import numpy as np

# 1. Point to the SINGLE source of truth in the backend folder
DATA_PATH = '../backend/data/career_dataset.json'

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"❌ Cannot find {DATA_PATH}. Make sure you are running this from the ml-service folder.")

# Load the master career data
with open(DATA_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

# The new JSON structure wraps the array in a "careers" key
careers_list = data.get('careers', [])

# Prepare training data and dynamic database
X_text = []
y_careers = []
dynamic_career_database = {}

# A helper dictionary to assign emojis based on the category
icon_map = {
    "Software Development": "💻",
    "Data Science & AI": "📊",
    "Cloud Computing": "☁️",
    "Security": "🔒",
    "Emerging Tech": "🚀",
    "Design": "🎨",
    "Product Management": "📋",
    "Software Testing": "🐛",
    "Infrastructure": "🏢",
    "Data Science": "📈"
}

for career in careers_list:
    title = career['title']
    category = career.get('category', 'Software Development')
    
    # 2. Build the dynamic career database (Replacing the hardcoded dictionary!)
    dynamic_career_database[title] = {
        'title': title,
        'description': career.get('description', ''),
        'required_skills': career.get('required_skills', []),
        'icon': icon_map.get(category, '💼') # Default to a briefcase if category not found
    }
    
    # 3. Build the training data 
    # Combine all keywords to teach the model what an ideal candidate looks like
    text_features = []
    text_features.extend(career.get('required_skills', []))
    text_features.extend(career.get('optional_skills', []))
    text_features.extend(career.get('skill_keywords', []))
    text_features.extend(career.get('interest_keywords', []))
    text_features.extend(career.get('education', []))
    text_features.extend(career.get('experience_levels', []))
    
    # Join everything into a single lowercase string for TF-IDF
    text = ' '.join(text_features).lower()
    
    X_text.append(text)
    y_careers.append(title)

# Vectorize text (Increased max_features to 200 since we have 18 careers now)
vectorizer = TfidfVectorizer(max_features=200)
X = vectorizer.fit_transform(X_text)

# Encode labels
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y_careers)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model, vectorizer, and our NEW dynamic database
with open('career_model.pkl', 'wb') as f:
    pickle.dump({
        'model': model,
        'vectorizer': vectorizer,
        'label_encoder': label_encoder,
        'career_database': dynamic_career_database  # <- 100% Dynamic now!
    }, f)

print(f"✅ Model trained and saved successfully!")
print(f"✅ Dynamically loaded {len(dynamic_career_database)} careers into the .pkl file.")
print(f"📊 Accuracy on training data: {model.score(X, y) * 100:.2f}%")