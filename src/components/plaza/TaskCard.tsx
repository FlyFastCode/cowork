import { MapPin, Trophy, Clock } from 'lucide-react';
import type { Task, User } from '../../types';

interface TaskCardProps {
  task: Task;
  publisher?: User | null;
  onClick: () => void;
}

export function TaskCard({ task, publisher, onClick }: TaskCardProps) {
  const statusColors = {
    available: 'bg-green-100 text-green-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    completed: 'bg-gray-100 text-gray-700',
    packaged: 'bg-purple-100 text-purple-700',
  };

  const statusText = {
    available: '可接取',
    'in-progress': '进行中',
    completed: '已完成',
    packaged: '已封装',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer
               overflow-hidden"
    >
      <div className="p-4">
        {/* 状态标签 */}
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
            statusColors[task.status]
          }`}
        >
          {statusText[task.status]}
        </span>

        {/* 任务标题 */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {task.title}
        </h3>

        {/* 任务描述 */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>

        {/* 技能标签 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 4 && (
            <span className="px-2 py-0.5 text-gray-400 text-xs">
              +{task.tags.length - 4}
            </span>
          )}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-1 text-purple-600 font-semibold">
            <Trophy className="w-4 h-4" />
            <span>{task.reward.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <MapPin className="w-3 h-3" />
            <span>{publisher?.name || '未知'}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock className="w-3 h-3" />
            <span>{task.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
