import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { 
  Users, Shield, Search, CheckCircle, Clock, 
  AlertCircle, X, Mail, Calendar, Briefcase, 
  Target, TrendingUp, BookOpen, ArrowLeft // ✅ Added ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/layout/Navbar'; // ❌ Removed Navbar import
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  
  // ✅ New State for the Selected User (Modal)
  const [selectedUser, setSelectedUser] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAllUsers();
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error("Admin Fetch Error:", err);
      if (err.response && err.response.status === 401) {
        setError("Session expired. Please login as Admin again.");
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError("Failed to load user data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) return <Loading message="Accessing Admin Database..." />;

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ❌ REMOVED <Navbar /> */}
      
      {/* ✅ NEW: Back Button Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4 shadow-sm flex items-center">
        <button 
          onClick={() => navigate('/login')} 
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <Shield className="w-8 h-8" /> Admin Dashboard
            </h1>
            <p className="text-gray-600">Overview of student progress and career paths</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            Refresh Data
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-3 mb-6">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* User Table */}
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-xl font-bold text-dark flex items-center gap-2">
              User Directory <span className="text-gray-400 text-sm font-normal">({users.length} total)</span>
            </h3>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none transition-all" 
                placeholder="Search students..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 border-b font-semibold">Name</th>
                  <th className="p-4 border-b font-semibold">Email</th>
                  <th className="p-4 border-b font-semibold">Joined</th>
                  <th className="p-4 border-b font-semibold">Career Path</th>
                  <th className="p-4 border-b font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr 
                      key={user._id} 
                      onClick={() => setSelectedUser(user)} // ✅ Click Row to Open Modal
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="p-4 font-bold text-gray-800 group-hover:text-primary transition-colors">
                        {user.name}
                      </td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4 text-gray-500 text-sm">{formatDate(user.createdAt)}</td>
                      <td className="p-4">
                        {user.recommendedCareer ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                            <Briefcase className="w-3 h-3" />
                            {user.recommendedCareer.title}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Not assigned</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details &rarr;
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ✅ DETAILED USER MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-start z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {selectedUser.email}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {formatDate(selectedUser.createdAt)}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              
              {/* 1. Career Overview */}
              {selectedUser.recommendedCareer ? (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {selectedUser.recommendedCareer.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {selectedUser.recommendedCareer.description}
                        </p>
                        <div className="flex gap-3">
                           <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-semibold text-green-700 shadow-sm">
                             <Target className="w-3 h-3" /> Match Score: {selectedUser.recommendedCareer.matchScore || 'N/A'}%
                           </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Reason */}
                    {selectedUser.recommendedCareer.reason && (
                      <div className="mt-4 pt-4 border-t border-blue-200/50">
                        <p className="text-sm text-gray-700 italic">
                          <span className="font-semibold text-blue-700">AI Analysis: </span>
                          "{selectedUser.recommendedCareer.reason}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 2. Skills Analysis Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Acquired Skills */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                      <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                        <CheckCircle className="w-4 h-4 text-green-600" /> Current Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.recommendedCareer.currentSkills?.length > 0 ? (
                          selectedUser.recommendedCareer.currentSkills.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md border border-green-200">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm italic">No skills recorded</span>
                        )}
                      </div>
                    </div>

                    {/* Skill Gap */}
                    <div className="border border-gray-200 rounded-xl p-4 bg-orange-50/30">
                      <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                        <BookOpen className="w-4 h-4 text-orange-600" /> Skills to Learn
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.recommendedCareer.skillGap?.length > 0 ? (
                          selectedUser.recommendedCareer.skillGap.map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white text-orange-700 text-xs rounded-md border border-orange-200 shadow-sm">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-green-600 text-sm font-medium">✨ All required skills mastered!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. Raw Data Debug (Optional - good for admins) */}
                  <div className="border-t border-gray-100 pt-4">
                    <details className="group">
                      <summary className="flex items-center gap-2 text-xs font-medium text-gray-400 cursor-pointer hover:text-primary">
                        <TrendingUp className="w-4 h-4" /> View Technical ID & Metadata
                      </summary>
                      <div className="mt-2 p-3 bg-gray-900 text-gray-300 rounded-lg text-xs font-mono overflow-auto max-h-32">
                        <p>User ID: {selectedUser._id}</p>
                        <p>Role: {selectedUser.role || 'Student'}</p>
                        <p>Last Update: {formatDate(selectedUser.updatedAt)}</p>
                      </div>
                    </details>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-gray-900 font-medium">No Career Path Generated</h3>
                  <p className="text-gray-500 text-sm mt-1">This user has not completed the onboarding assessment yet.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;