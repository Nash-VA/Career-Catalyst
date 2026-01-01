import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    education: '',
    skills: [],
    interests: [],
    careerGoals: '',
    expectedSalary: '',
    resume: null,
    careerRecommendations: [],
    skillGaps: [],
    completedOnboarding: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('userData');
    if (saved) {
      setUserData(JSON.parse(saved));
    }
  }, []);

  const updateUserData = (data) => {
    const updated = { ...userData, ...data };
    setUserData(updated);
    localStorage.setItem('userData', JSON.stringify(updated));
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};
