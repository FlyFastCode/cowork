import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Radar,
} from 'recharts';
import { Trophy, TrendingUp, Award, Star } from 'lucide-react';
import { useAchievements, useStats } from '../../hooks/useData';

export function AchievementPage() {
  const { achievements, rank } = useAchievements();
  const stats = useStats();

  if (!achievements) {
    return <div>未登录</div>;
  }

  // 雷达图数据
  const radarData = Object.entries(achievements.byCategory).map(([name, value]) => ({
    subject: name,
    value,
  }));

  // 趋势图数据（模拟）
  const trendData = [
    { date: '1 月', value: 2000 },
    { date: '2 月', value: 3500 },
    { date: '3 月', value: 5000 },
    { date: '4 月', value: 6500 },
    { date: '5 月', value: 8500 },
  ];

  // 按成就值排序的技能
  const sortedSkills = Object.entries(achievements.byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">成就值系统</h1>

      {/* 总览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* 总成就值 */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-70" />
          </div>
          <p className="text-purple-100 text-sm">总成就值</p>
          <p className="text-4xl font-bold mt-2">{achievements.total.toLocaleString()}</p>
        </div>

        {/* 总排名 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-yellow-500" />
            <span className="text-sm text-gray-500">Top {rank?.total || '-'}%</span>
          </div>
          <p className="text-gray-600 text-sm">总排名</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {rank ? Math.round(rank.totalPercentile) : '-'}
          </p>
        </div>

        {/* 擅长领域 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Star className="w-8 h-8 text-blue-500" />
            <span className="text-sm text-gray-500">{sortedSkills.length} 个领域</span>
          </div>
          <p className="text-gray-600 text-sm">最擅长</p>
          <p className="text-lg font-bold text-gray-900 mt-2">
            {sortedSkills[0]?.[0] || '-'}
          </p>
          <p className="text-sm text-purple-600">{sortedSkills[0]?.[1].toLocaleString()} 分</p>
        </div>

        {/* 平台统计 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-green-500" />
            <span className="text-sm text-gray-500">平台数据</span>
          </div>
          <p className="text-gray-600 text-sm">平均成就值</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {Math.round(stats.userStats.avgAchievement).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 技能雷达图 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">技能图谱</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                <Radar
                  name="成就值"
                  dataKey="value"
                  stroke="#9333ea"
                  fill="#9333ea"
                  fillOpacity={0.5}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 成就值趋势 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">成长轨迹</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#9333ea"
                  strokeWidth={3}
                  dot={{ fill: '#9333ea', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 领域详情 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">各领域成就值</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(achievements.byCategory).map(([category, value]) => (
            <div
              key={category}
              className="bg-purple-50 rounded-lg p-4 text-center"
            >
              <p className="text-sm text-purple-600 font-medium mb-1">{category}</p>
              <p className="text-2xl font-bold text-purple-700">{value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
