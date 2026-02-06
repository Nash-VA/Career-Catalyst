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

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ✅ NEW: Defined outside useEffect so it can be exported
  const fetchUserData = async () => {
    try {
      // Don't set loading to true here if you want background refreshes
      // But if you want a spinner during refresh, keep it:
      // setLoading(true); 
      
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          const fetchedUser = response.data.user;
          setUser(fetchedUser);
          
          setUserData({
            ...fetchedUser, // Keep original structure
            interests: fetchedUser.interests || [],
            experience: fetchedUser.experience || '',
            // Handle both flat and nested structure for safety
            onboardingCompleted: fetchedUser.onboardingData?.completedOnboarding || fetchedUser.onboardingCompleted || false,
            recommendedCareer: fetchedUser.recommendedCareer || null
          });
        }
      }
    } catch (error) {
      console.error('❌ Failed to load user:', error);
      // Only remove token if it's an auth error (401), not a network error
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  // ✅ Global Skill Completion Function
  const completeSkill = async (skillName) => {
    try {
      // 1. Call Backend using the configured 'api' instance
      // Note: 'api' already has baseURL and Authorization header set
      const res = await api.post('/user/update-career-progress', { 
        skill: skillName 
      });

      // 2. Update Local State Immediately (Optimistic Update)
      if (res.data.success) {
        setUserData(prev => {
          if (!prev || !prev.recommendedCareer) return prev;

          // Add skill to currentSkills
          const updatedSkills = [...(prev.recommendedCareer.currentSkills || [])];
          if (!updatedSkills.includes(skillName)) {
            updatedSkills.push(skillName);
          }

          // Remove from skillGap
          const updatedGap = (prev.recommendedCareer.skillGap || []).filter(s => s !== skillName);

          return {
            ...prev,
            recommendedCareer: {
              ...prev.recommendedCareer,
              currentSkills: updatedSkills,
              skillGap: updatedGap
            }
          };
        });
      }
    } catch (error) {
      console.error("Failed to complete skill:", error);
      throw error;
    }
  };

  const clearUserData = () => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem('token');
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
    <UserContext.Provider value={{ 
      user, 
      userData, 
      updateUserData, 
      completeSkill, 
      clearUserData, 
      loading,
      fetchUserData // ✅ Exposed so Onboarding can trigger a refresh
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);