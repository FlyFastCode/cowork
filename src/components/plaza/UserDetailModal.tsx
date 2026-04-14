import { X, Trophy } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import type { User } from '../../types';

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  // 准备雷达图数据
  const radarData = Object.entries(user.achievements.byCategory).map(([name, value]) => ({
    subject: name,
    A: value,
    fullMark: 5000,
  }));

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* 头部 */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-purple-200"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <div className="flex items-center gap-2 text-purple-600 font-semibold">
                  <Trophy className="w-5 h-5" />
                  <span>{user.achievements.total.toLocaleString()} 分</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 技能雷达图 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">技能图谱</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 5000]} />
                  <Radar
                    name={user.name}
                    dataKey="A"
                    stroke="#9333ea"
                    fill="#9333ea"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 技能详情 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">技能详情</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(user.achievements.byCategory).map(([category, value]) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                >
                  <span className="text-purple-700 font-medium">{category}</span>
                  <span className="text-purple-600 font-semibold">{value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 擅长技能 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">擅长技能</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
