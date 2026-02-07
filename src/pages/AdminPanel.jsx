import React, { useState, useEffect, useMemo } from 'react';
import { userAPI, adminAPI } from '../services/api'; 
import { 
  Users, Search, CheckCircle, AlertCircle, X, Mail, Calendar, 
  Briefcase, Target, TrendingUp, BookOpen, ArrowLeft, Download, 
  LayoutDashboard, Activity, PieChart as PieChartIcon, 
  Layers, Sparkles, GraduationCap, ChevronRight, Menu, LogOut, Settings
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/common/Loading';

// --- THEME CONFIGURATION ---
// Primary: Deep Teal (#274245)
// Accent: Warm Beige (#DFD6AE)
// Dominant: White / Off-White
const THEME = {
  primary: '#274245',
  accent: '#DFD6AE',
  bg: '#F9FAFB',      // Very light gray/white for main background
  surface: '#FFFFFF', // Pure white for cards
  text: '#1F2937',    // Dark gray for readability
  charts: ['#274245', '#DFD6AE', '#A8A29E', '#D6D3D1', '#78716C']
};

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'tween', ease: 'easeOut', duration: 0.3 } }
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // AI State
  const [aiInsight, setAiInsight] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  
  const navigate = useNavigate();

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the auth token
    localStorage.removeItem('user');  // Clear user data if stored
    navigate('/login');               // Redirect to Login page
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRes = await userAPI.getAllUsers();
      if (userRes.data.success) {
        setUsers(userRes.data.users);
      }
    } catch (err) {
      console.error("Admin Fetch Error:", err);
      if (err.response && err.response.status === 401) {
        // Auto-logout if session is invalid
        handleLogout();
      } else {
        setError("Failed to load dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- ANALYTICS ENGINE (Client-Side) ---
  const stats = useMemo(() => {
    if (!users.length) return null;

    const totalUsers = users.length;
    let predictionRequests = 0;
    let activeLearners = 0;
    const careerCounts = {};
    const skillGapCounts = {};
    
    // Time Setup
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    let usersThisMonth = 0;
    let usersLastMonth = 0;

    // Initialize Last 6 Months Bucket
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      return {
        name: d.toLocaleString('default', { month: 'short' }),
        monthIdx: d.getMonth(),
        year: d.getFullYear(),
        users: 0,
        predictions: 0
      };
    }).reverse();

    // Process Data
    users.forEach(user => {
      if (user.createdAt) {
        const userDate = new Date(user.createdAt);
        const uMonth = userDate.getMonth();
        const uYear = userDate.getFullYear();

        if (uMonth === currentMonth && uYear === currentYear) usersThisMonth++;
        if (uMonth === lastMonth && (uYear === currentYear || (lastMonth === 11 && uYear === currentYear - 1))) usersLastMonth++;

        const bucket = last6Months.find(b => b.monthIdx === uMonth && b.year === uYear);
        if (bucket) {
          bucket.users++;
          if (user.recommendedCareer) bucket.predictions++;
        }
      }

      if (user.recommendedCareer) {
        predictionRequests++;
        const title = user.recommendedCareer.title || 'Unknown';
        careerCounts[title] = (careerCounts[title] || 0) + 1;

        if (user.recommendedCareer.currentSkills?.length > 0) activeLearners++;

        user.recommendedCareer.skillGap?.forEach(skill => {
          skillGapCounts[skill] = (skillGapCounts[skill] || 0) + 1;
        });
      }
    });

    const careerTrends = Object.keys(careerCounts)
      .map(key => ({ name: key, value: careerCounts[key] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const skillDemand = Object.keys(skillGapCounts)
      .map(key => ({ name: key, demand: skillGapCounts[key] }))
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 7);

    // Calculate Growth
    let trendPercentage = 0;
    if (usersLastMonth > 0) {
      trendPercentage = Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100);
    } else if (usersThisMonth > 0) {
      trendPercentage = 100;
    }

    return {
      totalUsers,
      predictionRequests,
      activeLearners,
      engagementRate: Math.round((activeLearners / (totalUsers || 1)) * 100),
      careerTrends,
      skillDemand,
      growthData: last6Months,
      monthlyGrowth: trendPercentage
    };
  }, [users]);

  // --- AI INSIGHT GENERATION ---
  useEffect(() => {
    const generateAIReport = async () => {
      if (!stats || aiInsight || loadingAI) return;
      setLoadingAI(true);
      try {
        const res = await adminAPI.getAIInsights(stats);
        if (res.data.success) setAiInsight(res.data.analysis);
      } catch (err) {
        console.error("AI Generation Error", err);
      } finally {
        setLoadingAI(false);
      }
    };
    generateAIReport();
  }, [stats]);

  // --- CSV EXPORT FUNCTION ---
  const handleExport = () => {
    if (!stats) return;
    
    let csv = "Category,Item,Value\n";
    csv += `Overview,Total Users,${stats.totalUsers}\n`;
    csv += `Overview,Active Learners,${stats.activeLearners}\n`;
    csv += `Overview,Paths Generated,${stats.predictionRequests}\n`;
    stats.careerTrends.forEach(i => csv += `Career Trend,${i.name},${i.value}\n`);
    stats.skillDemand.forEach(i => csv += `Skill Demand,${i.name},${i.demand}\n`);
    
    const link = document.createElement("a");
    link.href = encodeURI("data:text/csv;charset=utf-8," + csv);
    link.download = `career_catalyst_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  // --- HELPER: FORMAT AI TEXT ---
  const formatAIResponse = (text) => {
    if (!text) return "Generating intelligent insights...";
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => 
      (part.startsWith('**') && part.endsWith('**')) 
        ? <strong key={index} style={{ color: THEME.primary }}>{part.slice(2, -2)}</strong> 
        : <span key={index}>{part}</span>
    );
  };

  if (loading) return <Loading message="Loading Admin Dashboard..." />;

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: THEME.bg, color: THEME.text }}>
      
      {/* --- TOP NAVIGATION --- */}
      <nav className="sticky top-0 z-30 px-6 py-3 shadow-md" style={{ backgroundColor: THEME.primary }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
          <div className="flex items-center gap-6">
            
            {/* BACK / LOGOUT BUTTON */}
            <button 
              onClick={handleLogout} 
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              title="Logout & Return to Login"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none tracking-wide">Admin Console</h1>
                <p className="text-[10px] uppercase tracking-widest opacity-70 mt-0.5" style={{ color: THEME.accent }}>User Management</p>
              </div>
            </div>
          </div>
          
          <div className="flex bg-black/20 p-1 rounded-lg backdrop-blur-md">
            {['dashboard', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-white shadow-sm' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                style={{ color: activeTab === tab ? THEME.primary : undefined }}
              >
                {tab === 'dashboard' ? <PieChartIcon size={14} /> : <Users size={14} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }} className="mb-6">
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-sm flex items-center gap-3">
                <AlertCircle size={20} /> {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          
          {/* =======================
              VIEW 1: DASHBOARD 
             ======================= */}
          {activeTab === 'dashboard' && stats && (
            <motion.div 
              key="dashboard"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header & Actions */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h2 className="text-3xl font-bold" style={{ color: THEME.primary }}>Platform Overview</h2>
                  <p className="text-gray-500 mt-1">Real-time insights and performance metrics.</p>
                </div>
                <button 
                  onClick={handleExport}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl transition-all shadow-sm hover:shadow-md"
                  style={{ color: THEME.primary }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = THEME.primary }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB' }}
                >
                  <Download size={18} />
                  <span className="font-medium">Export Report</span>
                </button>
              </motion.div>

              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Users" 
                  value={stats.totalUsers} 
                  icon={Users} 
                  trend={`${stats.monthlyGrowth > 0 ? '+' : ''}${stats.monthlyGrowth}%`}
                  trendUp={stats.monthlyGrowth >= 0}
                />
                <StatCard 
                  title="Paths Generated" 
                  value={stats.predictionRequests} 
                  icon={Briefcase} 
                  trend="High Interest"
                  trendUp={true}
                />
                <StatCard 
                  title="Engagement" 
                  value={`${stats.engagementRate}%`} 
                  icon={Activity} 
                  trend="Active Learners"
                  trendUp={true}
                />
                <StatCard 
                  title="Top Skill Gap" 
                  value={stats.skillDemand[0]?.name || 'N/A'} 
                  icon={Target} 
                  isAlert={true}
                  trend="Critical Need"
                  trendUp={false}
                />
              </div>

              {/* AI Insight Section */}
              <motion.div variants={itemVariants} className="relative overflow-hidden bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
                <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: THEME.primary }}></div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl text-white shadow-md" style={{ backgroundColor: THEME.primary }}>
                      <Sparkles className="w-6 h-6" style={{ color: THEME.accent }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: THEME.primary }}>
                        AI Executive Summary
                        {loadingAI && <span className="text-xs font-normal text-gray-400 animate-pulse ml-2">Analyze...</span>}
                      </h3>
                      <div className="mt-3 text-gray-600 leading-relaxed text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                        {loadingAI ? (
                          <div className="space-y-2 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ) : (
                          formatAIResponse(aiInsight)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Growth Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: THEME.primary }}>
                    <TrendingUp className="w-5 h-5" style={{ color: THEME.accent }} /> Platform Growth
                  </h3>
                  <div className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.growthData}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                          itemStyle={{ color: THEME.primary, fontWeight: 600 }}
                        />
                        <Area type="monotone" dataKey="users" stroke={THEME.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

               {/* Distribution Chart */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: THEME.primary }}>
                    <PieChartIcon className="w-5 h-5" style={{ color: THEME.accent }} /> Career Distribution
                  </h3>
                  <div className="flex-1 min-h-[300px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.careerTrends}
                          cx="50%"
                          cy="40%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {stats.careerTrends.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={THEME.charts[index % THEME.charts.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend 
                          verticalAlign="bottom" 
                          height={80} 
                          iconType="circle" 
                          iconSize={8} 
                          formatter={(value) => <span style={{ color: THEME.text }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-20">
                      <span className="text-3xl font-bold" style={{ color: THEME.primary }}>{stats.predictionRequests}</span>
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Users</span>
                    </div>
                  </div>
                </motion.div>

                {/* Skill Demand Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                   <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: THEME.primary }}>
                    <Layers className="w-5 h-5" style={{ color: THEME.accent }} /> Skill Demand Gap Analysis
                  </h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.skillDemand} barSize={32}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{fill: '#6B7280', fontSize: 12}} />
                        <RechartsTooltip 
                          cursor={{fill: '#F3F4F6'}} 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="demand" fill={THEME.accent} radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* =======================
              VIEW 2: USER TABLE 
             ======================= */}
          {activeTab === 'users' && (
            <motion.div 
              key="users"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold pl-2 flex items-center gap-2" style={{ color: THEME.primary }}>
                  <Users className="w-5 h-5" /> User Database
                </h3>
                <div className="relative w-full sm:w-80 mt-3 sm:mt-0 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#274245] transition-colors" />
                  <input 
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#274245]/20 focus:border-[#274245] outline-none transition-all placeholder:text-gray-400" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                        <th className="p-5 border-b border-gray-100">User Name</th>
                        <th className="p-5 border-b border-gray-100">Current Status</th>
                        <th className="p-5 border-b border-gray-100">Target Career</th>
                        <th className="p-5 border-b border-gray-100 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                          <motion.tr 
                            key={user._id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedUser(user)} 
                            className="hover:bg-gray-50 cursor-pointer transition-colors group"
                          >
                            <td className="p-5">
                              <div className="font-bold text-gray-800">{user.name}</div>
                              <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Mail size={10} /> {user.email}
                              </div>
                            </td>
                            <td className="p-5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                              </span>
                            </td>
                            <td className="p-5">
                              {user.recommendedCareer ? (
                                <span 
                                  className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-lg"
                                  style={{ backgroundColor: `${THEME.primary}10`, color: THEME.primary }}
                                >
                                  <Briefcase className="w-3.5 h-3.5" />
                                  {user.recommendedCareer.title}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs italic flex items-center gap-1">
                                  <AlertCircle size={12} /> Pending Analysis
                                </span>
                              )}
                            </td>
                            <td className="p-5 text-right">
                              <button className="text-gray-300 hover:text-[#274245] transition-colors">
                                <ChevronRight size={20} />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" className="p-10 text-center text-gray-500">No users found matching your search.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- DETAILED USER MODAL (Wholesome Style) --- */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            style={{ backgroundColor: `${THEME.primary}60` }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="text-white p-6 relative overflow-hidden" style={{ backgroundColor: THEME.primary }}>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 opacity-20" style={{ backgroundColor: THEME.accent }}></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      {selectedUser.name} <GraduationCap className="text-white/80" />
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
                      <span className="flex items-center gap-1"><Mail size={14} /> {selectedUser.email}</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(selectedUser.createdAt)}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8 bg-[#F9FAFB]">
                {selectedUser.recommendedCareer ? (
                  <>
                    {/* Career Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                       <div className="absolute -top-3 left-6 px-3 py-1 text-white text-xs font-bold rounded-full uppercase tracking-wider" style={{ backgroundColor: THEME.primary }}>
                         Current Trajectory
                       </div>
                       <div className="mt-2">
                         <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedUser.recommendedCareer.title}</h3>
                         <p className="text-gray-500 text-sm leading-relaxed mb-4">
                           {selectedUser.recommendedCareer.description}
                         </p>
                         <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className="h-2.5 rounded-full" 
                              style={{ width: `${selectedUser.recommendedCareer.matchScore || 70}%`, backgroundColor: THEME.primary }}
                            ></div>
                         </div>
                         <div className="flex justify-between text-xs font-medium text-gray-500 mt-1">
                            <span>Profile Match</span>
                            <span>{selectedUser.recommendedCareer.matchScore || 70}%</span>
                         </div>
                       </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Skills Acquired */}
                      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="flex items-center gap-2 font-bold text-gray-800 text-sm uppercase tracking-wide mb-3">
                          <CheckCircle size={16} className="text-emerald-500" /> Current Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.recommendedCareer.currentSkills?.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-100">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Learning Path */}
                      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="flex items-center gap-2 font-bold text-gray-800 text-sm uppercase tracking-wide mb-3">
                          <BookOpen size={16} style={{ color: THEME.primary }} /> Learning Path
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.recommendedCareer.skillGap?.map((skill, idx) => (
                            <span 
                              key={idx} 
                              className="px-3 py-1 text-xs font-medium rounded-lg shadow-sm"
                              style={{ backgroundColor: `${THEME.accent}40`, color: THEME.primary, border: `1px solid ${THEME.accent}60` }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">User has not taken the assessment yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Check back later once they complete onboarding.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENT: STAT CARD ---
const StatCard = ({ title, value, icon: Icon, trend, trendUp, isAlert }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group transition-all"
  >
    <div className="flex justify-between items-start mb-4">
      <div 
        className="p-3 rounded-xl transition-transform group-hover:scale-110 shadow-sm"
        style={{ backgroundColor: isAlert ? '#FEE2E2' : `${THEME.primary}15`, color: isAlert ? '#DC2626' : THEME.primary }}
      >
        <Icon size={24} />
      </div>
      {trend && (
        <span 
          className={`text-xs font-bold px-2 py-1 rounded-full border flex items-center gap-1 
            ${isAlert 
              ? 'bg-red-50 text-red-700 border-red-100' 
              : trendUp 
                ? 'bg-green-50 text-green-700 border-green-100' 
                : 'bg-gray-50 text-gray-700 border-gray-100'
            }`}
        >
          {isAlert ? <AlertCircle size={10} /> : <TrendingUp size={10} />}
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-3xl font-bold mb-1" style={{ color: THEME.primary }}>{value}</h3>
    <p className="text-sm text-gray-400 font-medium">{title}</p>
  </motion.div>
);

export default AdminPanel;