import json
import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import numpy as np

# Load career data
with open('career_data.json', 'r') as f:
    data = json.load(f)

# Prepare training data
X_text = []
y_careers = []

for entry in data:
    # Combine all text features
    text = ' '.join(entry['skills']) + ' ' + \
           ' '.join(entry['interests']) + ' ' + \
           entry['field_of_study'] + ' ' + \
           entry['experience']
    X_text.append(text.lower())
    y_careers.append(entry['career'])

# Vectorize text
vectorizer = TfidfVectorizer(max_features=100)
X = vectorizer.fit_transform(X_text)

# Encode labels
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y_careers)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model and vectorizer
with open('career_model.pkl', 'wb') as f:
    pickle.dump({
        'model': model,
        'vectorizer': vectorizer,
        'label_encoder': label_encoder,
        'career_database': {
            'Full Stack Developer': {
                'title': 'Full Stack Developer',
                'description': 'Build complete web applications from front-end to back-end',
                'required_skills': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API', 'Git'],
                'icon': '💻'
            },
            'Data Scientist': {
                'title': 'Data Scientist',
                'description': 'Analyze complex data sets and build predictive models',
                'required_skills': ['Python', 'Machine Learning', 'SQL', 'Pandas', 'Statistics'],
                'icon': '📊'
            },
            'UX/UI Designer': {
                'title': 'UX/UI Designer',
                'description': 'Create user-centered digital experiences',
                'required_skills': ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'HTML', 'CSS'],
                'icon': '🎨'
            },
            'DevOps Engineer': {
                'title': 'DevOps Engineer',
                'description': 'Automate and optimize software deployment',
                'required_skills': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Jenkins'],
                'icon': '⚙️'
            },
            'Mobile App Developer': {
                'title': 'Mobile App Developer',
                'description': 'Create native and cross-platform mobile applications',
                'required_skills': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
                'icon': '📱'
            }
        }
    }, f)

print("✅ Model trained and saved successfully!")
print(f"Accuracy on training data: {model.score(X, y) * 100:.2f}%")
