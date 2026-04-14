import { useState, useMemo } from 'react';
import { useSkills, useUsers } from '../../hooks/useData';
import { Star, TrendingUp, Users } from 'lucide-react';
import type { Skill } from '../../types';

type SortType = 'rating' | 'calls' | 'revenue';

export function MarketplacePage() {
  const { sortedByRating, sortedByCalls, sortedByRevenue } = useSkills();
  const [sortType, setSortType] = useState<SortType>('rating');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const sortedSkills = useMemo(() => {
    switch (sortType) {
      case 'rating':
        return sortedByRating;
      case 'calls':
        return sortedByCalls;
      case 'revenue':
        return sortedByRevenue;
      default:
        return sortedByRating;
    }
  }, [sortType, sortedByRating, sortedByCalls, sortedByRevenue]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Skill 商城</h1>

      {/* 排序选项 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">排序：</span>
          <button
            onClick={() => setSortType('rating')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortType === 'rating'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            评分
          </button>
          <button
            onClick={() => setSortType('calls')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortType === 'calls'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            调用量
          </button>
          <button
            onClick={() => setSortType('revenue')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortType === 'revenue'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            收益
          </button>
        </div>
      </div>

      {/* Skill 列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSkills.map((skill: Skill) => (
          <div
            key={skill.id}
            onClick={() => setSelectedSkill(skill)}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer
                     hover:shadow-xl transition-all"
          >
            <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-600" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{skill.name}</h3>
                  <p className="text-sm text-gray-500">v{skill.version}</p>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                  {skill.category}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {skill.description}
              </p>

              {/* 统计数据 */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{skill.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">评分</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">{skill.totalCalls}</span>
                  </div>
                  <p className="text-xs text-gray-500">调用</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-500">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold">{skill.owners.length}</span>
                  </div>
                  <p className="text-xs text-gray-500">共创</p>
                </div>
              </div>

              {/* 底部信息 */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500">单次调用</p>
                  <p className="text-lg font-bold text-purple-600">
                    ¥{skill.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">总收益</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ¥{skill.totalRevenue.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 详情弹窗 */}
      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  );
}

interface SkillDetailModalProps {
  skill: Skill;
  onClose: () => void;
}

function SkillDetailModal({ skill, onClose }: SkillDetailModalProps) {
  const { getUserById } = useUsers();

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
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{skill.name}</h2>
              <p className="text-gray-500">版本 v{skill.version}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>

          {/* 描述 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">功能描述</h3>
            <p className="text-gray-600">{skill.description}</p>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{skill.rating}</p>
              <p className="text-xs text-yellow-600">评分</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{skill.totalCalls}</p>
              <p className="text-xs text-blue-600">总调用</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{skill.totalRevenue}</p>
              <p className="text-xs text-green-600">总收益</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{skill.price}</p>
              <p className="text-xs text-purple-600">单次价格</p>
            </div>
          </div>

          {/* 共创股东 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">共创股东</h3>
            <div className="space-y-3">
              {skill.owners.map((owner) => {
                const user = getUserById(owner.userId);
                return (
                  <div
                    key={owner.userId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {user?.avatar && (
                        <img
                          src={user.avatar}
                          alt={owner.userName}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{owner.userName}</p>
                        <p className="text-xs text-gray-500">{owner.contributionType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">{owner.sharePercentage}%</p>
                      <p className="text-xs text-gray-500">持股</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 收益分配 */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm font-medium text-purple-700 mb-2">收益分配示例</h3>
            <p className="text-sm text-purple-600">
              每次调用收益 ¥{skill.price}，扣除平台 10% 后：
            </p>
            <div className="mt-2 space-y-1">
              {skill.owners.map((owner) => (
                <div key={owner.userId} className="flex justify-between text-sm">
                  <span className="text-purple-600">{owner.userName}</span>
                  <span className="text-purple-700 font-medium">
                    +¥{(skill.price * 0.9 * owner.sharePercentage / 100).toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-6">
            <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
              立即购买 / 调用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
