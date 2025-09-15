import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { User, Trophy, Code, Target, TrendingUp, Award, Calendar, School, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const SkillRackDashboard = () => {
  const [profileUrl, setProfileUrl] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validatingUrl, setValidatingUrl] = useState(false);
  const [urlValid, setUrlValid] = useState(null);

  // API base URL - change this to your backend URL
  const API_BASE_URL = 'http://localhost:5000';

  // Mock data for demonstration
  const mockData = {
    'Name': 'VISHVA VAAKINI I K',
    'Roll Number': '917722IT132',
    'Department': 'IT',
    'College': 'Thiagarajar College of Engineering (TCE), Madurai',
    'Year': '(Pre-Final Year) 2026',
    'RANK': '10316',
    'LEVEL': '0/10',
    'GOLD': '0',
    'SILVER': '0',
    'BRONZE': '421',
    'PROGRAMS SOLVED': '1251',
    'CODE TEST': '22',
    'CODE TRACK': '1050',
    'DC': '55',
    'DT': '102',
    'CODE TUTOR': '22',
    'C': '564',
    'Python3': '288',
    'Java': '220',
    'CPP23': '178',
    'CPP': '1'
  };

  const validateUrl = async (url) => {
    if (!url.trim()) {
      setUrlValid(null);
      return;
    }

    setValidatingUrl(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/validate-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const result = await response.json();
      setUrlValid(result.valid);
    } catch (err) {
      console.error('URL validation error:', err);
      setUrlValid(false);
    } finally {
      setValidatingUrl(false);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setProfileUrl(url);
    
    // Debounce URL validation
    clearTimeout(window.urlValidationTimeout);
    window.urlValidationTimeout = setTimeout(() => {
      validateUrl(url);
    }, 500);
  };

  const handleSubmit = async () => {
    if (!profileUrl.trim()) {
      setError('Please enter a valid SkillRack profile URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: profileUrl.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setProfileData(result.data);
      } else {
        setError(result.error || 'Failed to fetch profile data');
      }
    } catch (err) {
      console.error('API error:', err);
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculatePoints = (data) => {
    const codeTutor = parseInt(data['CODE TUTOR'] || 0) * 0;
    const codeTrack = parseInt(data['CODE TRACK'] || 0) * 2;
    const dc = parseInt(data['DC'] || 0) * 2;
    const dt = parseInt(data['DT'] || 0) * 20;
    const codeTest = parseInt(data['CODE TEST'] || 0) * 30;
    
    const totalPoints = codeTutor + codeTrack + dc + dt + codeTest;
    const solvedPrograms = parseInt(data['PROGRAMS SOLVED'] || 0);
    const solvedPercentage = ((solvedPrograms / 2000) * 100).toFixed(2);
    const pointsPercentage = ((totalPoints / 5000) * 100).toFixed(2);

    return {
      breakdown: [
        { category: 'Code Tutor', count: parseInt(data['CODE TUTOR'] || 0), multiplier: 0, points: codeTutor },
        { category: 'Code Track', count: parseInt(data['CODE TRACK'] || 0), multiplier: 2, points: codeTrack },
        { category: 'DC', count: parseInt(data['DC'] || 0), multiplier: 2, points: dc },
        { category: 'DT', count: parseInt(data['DT'] || 0), multiplier: 20, points: dt },
        { category: 'Code Test', count: parseInt(data['CODE TEST'] || 0), multiplier: 30, points: codeTest }
      ],
      totalPoints,
      solvedPrograms,
      solvedPercentage,
      pointsPercentage
    };
  };

  const getLanguageData = (data) => {
    const languages = ['C', 'Python3', 'Java', 'CPP23', 'CPP'];
    return languages.map(lang => ({
      name: lang,
      value: parseInt(data[lang] || 0)
    })).filter(item => item.value > 0);
  };

  const getMedalData = (data) => [
    { name: 'Gold', value: parseInt(data['GOLD'] || 0), color: '#FFD700' },
    { name: 'Silver', value: parseInt(data['SILVER'] || 0), color: '#C0C0C0' },
    { name: 'Bronze', value: parseInt(data['BRONZE'] || 0), color: '#CD7F32' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                SkillRack Analytics
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-20 blur-2xl -z-10"></div>
            </div>
            <p className="text-xl text-gray-600 mb-2">Transform Your Coding Journey into Beautiful Insights</p>
            <p className="text-gray-500">Enter your SkillRack profile URL to unlock detailed performance analytics</p>
          </div>
          
          {/* Input Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50 p-8 max-w-2xl mx-auto">
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-3">
                  <Code className="w-5 h-5 text-blue-600 mr-2" />
                  <label className="block text-sm font-semibold text-gray-700">
                    SkillRack Profile URL
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={profileUrl}
                    onChange={handleUrlChange}
                    placeholder="http://www.skillrack.com/profile/123456/abcdef..."
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      urlValid === true ? 'border-green-400 bg-green-50' : 
                      urlValid === false ? 'border-red-400 bg-red-50' : 
                      'border-gray-200'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {validatingUrl ? (
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    ) : urlValid === true ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : urlValid === false ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : null}
                  </div>
                </div>
                {urlValid === false && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Please enter a valid SkillRack profile URL
                  </p>
                )}
              </div>
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-4 rounded-xl flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={loading || urlValid === false}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Analyzing Profile...
                  </div>
                ) : (
                  'Generate Analytics Dashboard'
                )}
              </button>
            </div>
            
            <div className="mt-8 text-center border-t pt-6">
              <p className="text-gray-500 text-sm mb-3">Want to see how it works?</p>
              <button
                onClick={() => setProfileData(mockData)}
                className="text-blue-600 hover:text-blue-800 underline text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
              >
                View Demo Dashboard
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Performance Analytics</h3>
              <p className="text-gray-600 text-sm">Deep insights into your coding performance and progress tracking</p>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Achievement Overview</h3>
              <p className="text-gray-600 text-sm">Visual representation of your medals and accomplishments</p>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
              <Code className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Language Breakdown</h3>
              <p className="text-gray-600 text-sm">Detailed analysis of your programming language expertise</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pointsData = calculatePoints(profileData);
  const languageData = getLanguageData(profileData);
  const medalData = getMedalData(profileData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkillRack Analytics Dashboard
            </h1>
            <button
              onClick={() => setProfileData(null)}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              New Analysis
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <User className="w-10 h-10 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Student Name</p>
                <p className="font-bold text-gray-800">{profileData['Name']}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <School className="w-10 h-10 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Department</p>
                <p className="font-bold text-gray-800">{profileData['Department']}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
              <Trophy className="w-10 h-10 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Current Rank</p>
                <p className="font-bold text-gray-800">#{profileData['RANK']}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
              <Target className="w-10 h-10 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600 font-medium">Current Level</p>
                <p className="font-bold text-gray-800">{profileData['LEVEL']}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Programs Solved</p>
                <p className="text-3xl font-bold text-blue-600">{profileData['PROGRAMS SOLVED']}</p>
                <p className="text-sm text-green-600 font-medium">{pointsData.solvedPercentage}% of 2000</p>
              </div>
              <Code className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Points</p>
                <p className="text-3xl font-bold text-green-600">{pointsData.totalPoints}</p>
                <p className="text-sm text-green-600 font-medium">{pointsData.pointsPercentage}% of 5000</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Bronze Medals</p>
                <p className="text-3xl font-bold text-orange-600">{profileData['BRONZE']}</p>
                <p className="text-sm text-gray-500 font-medium">Achievement Level</p>
              </div>
              <Award className="w-12 h-12 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Academic Year</p>
                <p className="text-2xl font-bold text-purple-600">{profileData['Year']}</p>
                <p className="text-sm text-gray-500 font-medium">Current Status</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Points Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Points Breakdown Analysis</h3>
            <div className="space-y-4">
              {pointsData.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-semibold text-gray-800">{item.category}</p>
                    <p className="text-sm text-gray-600">{item.count} × {item.multiplier} = {item.points} points</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">{item.points}</p>
                  </div>
                </div>
              ))}
              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <p className="font-bold text-lg text-gray-800">Total Points</p>
                  <p className="text-3xl font-bold text-green-600">{pointsData.totalPoints}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pointsData.breakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="category" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                  fontSize={12}
                  stroke="#6b7280"
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="points" 
                  fill="url(#colorGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.9}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Distribution & Medals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Programming Languages Mastery</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {languageData.map((lang, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{backgroundColor: COLORS[index % COLORS.length]}}
                  ></div>
                  <span className="text-sm font-medium">{lang.name}: {lang.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Medal Collection</h3>
            <div className="space-y-4 mb-6">
              {medalData.map((medal, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl shadow-sm" style={{backgroundColor: `${medal.color}15`, border: `2px solid ${medal.color}30`}}>
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full shadow-lg" style={{backgroundColor: medal.color}}></div>
                    <span className="font-semibold text-gray-800">{medal.name} Medals</span>
                  </div>
                  <span className="text-3xl font-bold" style={{color: medal.color}}>{medal.value}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={medalData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* College Information */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-600 font-medium mb-2">Roll Number</p>
              <p className="font-bold text-xl text-gray-800">{profileData['Roll Number']}</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <p className="text-sm text-gray-600 font-medium mb-2">College</p>
              <p className="font-bold text-lg text-gray-800">{profileData['College']}</p>
            </div>
            <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <p className="text-sm text-gray-600 font-medium mb-2">Current Rank</p>
              <p className="font-bold text-xl text-gray-800">#{profileData['RANK']}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillRackDashboard;