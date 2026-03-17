import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Briefcase, Target, DollarSign, TrendingUp, Monitor } from 'lucide-react';
import './Dashboard.css';

// --- MOCK DATA ---
const demandData = [
  { month: 'Jan', demand: 400 },
  { month: 'Feb', demand: 550 },
  { month: 'Mar', demand: 600 },
  { month: 'Apr', demand: 750 },
  { month: 'May', demand: 820 },
  { month: 'Jun', demand: 980 },
];

const skillsData = [
  { name: 'Python', value: 95 },
  { name: 'JavaScript', value: 88 },
  { name: 'SQL', value: 85 },
  { name: 'AWS', value: 78 },
  { name: 'Docker', value: 75 },
];

const domainData = [
  { name: 'Machine Learning', value: 400, color: '#06b6d4' },
  { name: 'Data Engineering', value: 300, color: '#8b5cf6' },
  { name: 'Cloud Architecture', value: 300, color: '#3b82f6' },
  { name: 'Full Stack Dev', value: 200, color: '#ec4899' },
];

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
  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1 className="page-title">Career Analytics Dashboard</h1>
        <p className="page-subtitle">AI-powered insights based on your profile and market data.</p>
      </header>
      
      {/* Top Statistic Cards */}
      <div className="stats-grid">
        <StatCard 
          title="Predicted Role" 
          value="AI Engineer" 
          icon={Briefcase} 
          color="#06b6d4" 
        />
        <StatCard 
          title="Match Score" 
          value="92%" 
          icon={Target} 
          color="#10b981" 
          sparklineData={demandData}
          sparklineKey="demand"
        />
        <StatCard 
          title="Avg Salary" 
          value="$145k" 
          icon={DollarSign} 
          color="#8b5cf6" 
          sparklineData={demandData}
          sparklineKey="demand"
        />
        <StatCard 
          title="Demand Growth" 
          value="+24%" 
          icon={TrendingUp} 
          color="#f59e0b" 
          sparklineData={demandData}
          sparklineKey="demand"
        />
        <StatCard 
          title="Top Skill" 
          value="Python" 
          icon={Monitor} 
          color="#ec4899" 
        />
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Line Chart */}
        <div className="chart-card glass-panel">
          <h3 className="chart-title">Job Demand Trend</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b' }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Line type="monotone" dataKey="demand" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#131432', stroke: '#06b6d4', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-card glass-panel">
          <h3 className="chart-title">Top Programming Skills</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fill: '#64748b' }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart-card glass-panel full-width">
          <h3 className="chart-title">Career Domain Distribution</h3>
          <div className="chart-wrapper pie-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={domainData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {domainData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
