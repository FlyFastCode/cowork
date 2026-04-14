import { Trophy, Star } from 'lucide-react';
import type { User } from '../../types';

interface UserListProps {
  users: User[];
  sortType: string;
  onSelectUser: (user: User) => void;
}

export function UserList({ users, sortType, onSelectUser }: UserListProps) {
  const getMedalColor = (index: number) => {
    if (index === 0) return 'from-yellow-400 to-yellow-600';
    if (index === 1) return 'from-gray-300 to-gray-500';
    if (index === 2) return 'from-amber-600 to-amber-800';
    return '';
  };

  const getAchievementValue = (user: User, type: string) => {
    if (type === 'total') return user.achievements.total;
    return user.achievements.byCategory[type] || 0;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid gap-4 p-4">
        {users.map((user, index) => {
          const value = getAchievementValue(user, sortType);
          const rank = index + 1;

          return (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-100
                       hover:bg-purple-50 hover:border-purple-200 transition-colors cursor-pointer"
            >
              {/* 排名 */}
              <div className="relative">
                {rank <= 3 ? (
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${getMedalColor(
                      index
                    )} flex items-center justify-center text-white font-bold shadow`}
                  >
                    {rank}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
                    {rank}
                  </div>
                )}
              </div>

              {/* 头像 */}
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />

              {/* 用户信息 */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{user.skills.length} 个技能</span>
                  <span>•</span>
                  <span>{user.createdAt} 加入</span>
                </div>
              </div>

              {/* 成就值 */}
              <div className="text-right">
                <div className="flex items-center gap-1 text-purple-600 font-bold text-lg">
                  <Trophy className="w-5 h-5" />
                  <span>{value.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {sortType === 'total' ? '总成就值' : sortType}
                </p>
              </div>

              {/* 箭头 */}
              <Star className="w-5 h-5 text-gray-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
