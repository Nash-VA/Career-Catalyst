import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Load from localStorage on mount
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('careerCatalystUserData');
    return saved ? JSON.parse(saved) : {
      interests: [],
      skills: [],
      education: '',
      experience: '',
      recommendedCareer: null
    };
  });

  // Save to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem('careerCatalystUserData', JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  const clearUserData = () => {
    setUserData({
      interests: [],
      skills: [],
      education: '',
      experience: '',
      recommendedCareer: null
    });
    localStorage.removeItem('careerCatalystUserData');
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export default UserContext;
