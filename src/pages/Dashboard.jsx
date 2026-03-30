import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts';
import { Briefcase, Target, DollarSign, TrendingUp, Monitor, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePrediction } from '../context/PredictionContext';
import './Dashboard.css';

import { roleAnalytics, domainDistribution } from '../data/dashboardData';

// Reusable mini sparkline wrapper
const SparkLine = ({ data, dataKey, color }) => (
  <div className="sparkline-container">
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const StatCard = ({ title, value, icon: Icon, color, sparklineData, sparklineKey }) => (
  <div className="stat-card glass-panel">
    <div className="stat-card-header">
      <div className="stat-card-info">
        <h3 className="stat-title">{title}</h3>
        <span className="stat-value">{value}</span>
      </div>
      <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}20`, color: color }}>
        <Icon size={24} />
      </div>
    </div>
    {sparklineData && (
      <SparkLine data={sparklineData} dataKey={sparklineKey} color={color} />
    )}
  </div>
);

export default function Dashboard() {
  const { predictionData } = usePrediction();
  
  // Dynamic fallback mapping
  const displayRole = predictionData?.role || "Software Engineer";
  const displayMatch = predictionData?.match ? `${predictionData.match}%` : "N/A";
  const missingSkills = predictionData?.missingSkills || ["Node.js", "System Design"];
  
  // Safely extract role analytics or default to Software Engineer if unmatched
  const analytics = roleAnalytics[displayRole] || roleAnalytics["Software Engineer"];
  
  const displaySkill = analytics.topSkills[0]?.name || "Unknown";
  const demandData = analytics.demandTrend;
  const skillsData = [...analytics.topSkills].sort((a,b) => b.value - a.value);

  // Custom tooltips
  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-md border border-slate-100 flex flex-col pointer-events-none">
          <p className="font-semibold text-slate-700 text-sm mb-1">{label}</p>
          <p className="text-[#06b6d4] font-bold text-sm">Index: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-md border border-slate-100 flex flex-col pointer-events-none">
          <p className="font-semibold text-slate-700 text-sm mb-1">{label}</p>
          <p className="text-[#8b5cf6] font-bold text-sm">Relevance: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <header className="page-header text-center">
        <h1 className="page-title text-3xl font-bold text-slate-900 mt-4 mb-2">Career Analytics Dashboard</h1>
        <p className="page-subtitle text-slate-500 mb-8">AI-powered insights based on your profile and market data.</p>
      </header>
      
      {/* Top Statistic Cards (UNCHANGED) */}
      <div className="stats-grid">
        <StatCard 
          title="Predicted Role" 
          value={displayRole} 
          icon={Briefcase} 
          color="#06b6d4" 
        />
        <StatCard 
          title="Match Score" 
          value={displayMatch} 
          icon={Target} 
          color="#10b981" 
          sparklineData={demandData}
          sparklineKey="demand"
        />
        <StatCard 
          title="Avg Salary" 
          value={analytics.salary} 
          icon={DollarSign} 
          color="#8b5cf6" 
          sparklineData={demandData}
          sparklineKey="demand"
        />
        <StatCard 
          title="Demand Growth" 
          value={analytics.growth} 
          icon={TrendingUp} 
          color="#f59e0b" 
          sparklineData={demandData}
          sparklineKey="demand"
        />
        <StatCard 
          title="Top Skill" 
          value={displaySkill} 
          icon={Monitor} 
          color="#ec4899" 
        />
      </div>

      {/* New Insights & Recommendations Section */}
      <div className="insights-section w-full mb-2">
        <h3 className="chart-title text-slate-800 font-bold text-lg mb-6 inline-block relative">Insights & Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI Summary Card */}
          <div className="stat-card glass-panel bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col text-left">
            <h4 className="text-slate-800 font-bold mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
              <Zap size={20} className="text-amber-500 fill-amber-500" /> AI Summary
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              You are a <strong className="text-slate-800 font-semibold">strong match</strong> for the <strong className="text-indigo-600">{displayRole}</strong> role. 
              Capitalizing on your core competencies and acquiring high-priority missing skills will significantly elevate your market competitiveness.
            </p>
          </div>

          {/* Recommended Actions */}
          <div className="stat-card glass-panel bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col text-left">
            <h4 className="text-slate-800 font-bold mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
              <Target size={20} className="text-emerald-500" /> Recommended Actions
            </h4>
            <ul className="flex flex-col gap-3">
              {missingSkills.slice(0, 2).map((skill, idx) => (
                <li key={`rec-${idx}`} className="flex gap-2 items-start text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span>Learn <strong className="text-slate-800 font-medium">{skill}</strong></span>
                </li>
              ))}
              <li className="flex gap-2 items-start text-sm text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>Build 2 production-ready projects</span>
              </li>
            </ul>
          </div>

          {/* Skill Insights */}
          <div className="stat-card glass-panel bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col text-left">
            <h4 className="text-slate-800 font-bold mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
              <Monitor size={20} className="text-indigo-500" /> Skill Insights
            </h4>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Strong Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skillsData.slice(0, 3).map((s, i) => (
                    <span key={`strong-${i}`} className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-xs font-semibold">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Missing Skills</p>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.slice(0, 2).map((s, i) => (
                    <span key={`miss-${i}`} className="bg-rose-50 text-rose-700 border border-rose-100 px-2 py-1 rounded text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Original Side-by-Side Charts Layout from Screenshot */}
      <div className="charts-grid w-full pb-8">
        
        {/* Line Chart */}
        <div className="chart-card glass-panel flex flex-col pt-6 px-6 pb-2 w-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="chart-title !mb-0 text-slate-800 font-bold text-lg">Job Demand Trend</h3>
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <TrendingUp size={14} /> Demand is steadily increasing
            </span>
          </div>
          <div className="chart-wrapper flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomLineTooltip />} cursor={{ stroke: 'rgba(6, 182, 212, 0.2)', strokeWidth: 2 }} />
                <Line 
                  type="monotone" 
                  dataKey="demand" 
                  stroke="#06b6d4" 
                  strokeWidth={3} 
                  dot={{ fill: '#ffffff', stroke: '#06b6d4', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 8, fill: '#06b6d4', stroke: '#ffffff', strokeWidth: 3 }} 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-card glass-panel flex flex-col pt-6 px-6 pb-2 w-full">
          <div className="mb-6">
            <h3 className="chart-title !mb-0 text-slate-800 font-bold text-lg">Top Programming Skills</h3>
          </div>
          <div className="chart-wrapper flex-1 w-full min-h-[300px] pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} layout="vertical" barCategoryGap="20%" margin={{ top: 0, right: 50, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontWeight={500} tick={{ fill: '#475569', fontSize: 13 }} width={100} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} animationDuration={1500}>
                  <LabelList 
                    dataKey="value" 
                    position="right" 
                    formatter={(val) => `${val}%`} 
                    style={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                    offset={8}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
}
