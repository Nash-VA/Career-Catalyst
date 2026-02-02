import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ API instance
  const api = axios.create({
    baseURL: 'http://localhost:5000/api'
  });

  // Add token to requests
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ✅ Load user data from backend on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          console.log('🔄 Loading user from backend...');
          const response = await api.get('/auth/me');
          
          if (response.data.success) {
            const fetchedUser = response.data.user;
            console.log('✅ User loaded:', fetchedUser.email);
            console.log('   Recommended Career:', fetchedUser.recommendedCareer?.title || 'Not set');
            
            setUser(fetchedUser);
            setUserData({
              interests: fetchedUser.interests || [],
              skills: fetchedUser.skills || [],
              experience: fetchedUser.experience || '',
              onboardingCompleted: fetchedUser.onboardingCompleted || false,
              recommendedCareer: fetchedUser.recommendedCareer || null
            });
          }
        }
      } catch (error) {
        console.error('❌ Failed to load user:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const updateUserData = (newData) => {
    console.log('📝 Updating user data:', newData);
    setUserData(prev => ({ ...prev, ...newData }));
  };

  const clearUserData = () => {
    console.log('🗑️ Clearing user data');
    setUser(null);
    setUserData(null);
    localStorage.removeItem('token');
    localStorage.removeItem('careerCatalystUserData');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, userData, updateUserData, clearUserData }}>
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
