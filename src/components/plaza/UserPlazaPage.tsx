import { useState, useMemo } from 'react';
import { useUsers } from '../../hooks/useData';
import { UserList } from './UserList';
import { UserDetailModal } from './UserDetailModal';
import { Medal } from 'lucide-react';
import type { User } from '../../types';

type SortType = 'total' | string;

export function UserPlazaPage() {
  const { users, sortedByTotalAchievement, sortedByCategory } = useUsers();
  const [sortType, setSortType] = useState<SortType>('total');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 所有技能领域
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    users.forEach((u: User) => {
      Object.keys(u.achievements.byCategory).forEach((c) => categories.add(c));
    });
    return Array.from(categories);
  }, [users]);

  // 排序后的用户列表
  const sortedUsers = useMemo(() => {
    if (sortType === 'total') {
      return sortedByTotalAchievement;
    }
    return sortedByCategory(sortType);
  }, [sortType, sortedByTotalAchievement, sortedByCategory]);

  // 前三名用户
  const topUsers = useMemo(() => sortedUsers.slice(0, 3), [sortedUsers]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">用户广场</h1>

      {/* 排行榜前三 */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Medal className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900">排行榜</h2>
        </div>

        <div className="flex items-end justify-center gap-8">
          {/* 第二名 */}
          {topUsers[1] && (
            <div className="text-center">
              <div className="relative mb-2">
                <img
                  src={topUsers[1].avatar}
                  alt={topUsers[1].name}
                  className="w-20 h-20 rounded-full border-4 border-gray-300 mx-auto"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-300 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <p className="font-medium text-gray-900">{topUsers[1].name}</p>
              <p className="text-sm text-gray-500">{topUsers[1].achievements.total} 分</p>
            </div>
          )}

          {/* 第一名 */}
          {topUsers[0] && (
            <div className="text-center">
              <div className="relative mb-2">
                <img
                  src={topUsers[0].avatar}
                  alt={topUsers[0].name}
                  className="w-24 h-24 rounded-full border-4 border-yellow-400 mx-auto"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                  1
                </div>
              </div>
              <p className="font-bold text-gray-900">{topUsers[0].name}</p>
              <p className="text-sm text-purple-600 font-semibold">{topUsers[0].achievements.total} 分</p>
            </div>
          )}

          {/* 第三名 */}
          {topUsers[2] && (
            <div className="text-center">
              <div className="relative mb-2">
                <img
                  src={topUsers[2].avatar}
                  alt={topUsers[2].name}
                  className="w-20 h-20 rounded-full border-4 border-amber-600 mx-auto"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <p className="font-medium text-gray-900">{topUsers[2].name}</p>
              <p className="text-sm text-gray-500">{topUsers[2].achievements.total} 分</p>
            </div>
          )}
        </div>
      </div>

      {/* 排序选择 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSortType('total')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortType === 'total'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            总成就值
          </button>
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSortType(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                sortType === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 用户列表 */}
      <UserList
        users={sortedUsers}
        sortType={sortType}
        onSelectUser={setSelectedUser}
      />

      {/* 用户详情弹窗 */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
