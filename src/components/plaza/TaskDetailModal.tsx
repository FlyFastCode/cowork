import { X } from 'lucide-react';
import type { Task, User } from '../../types';

interface TaskDetailModalProps {
  task: Task;
  publisher?: User | null;
  onClose: () => void;
  onTake: (taskId: string) => void;
}

export function TaskDetailModal({ task, publisher, onClose, onTake }: TaskDetailModalProps) {
  const canTake = task.status === 'available';

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
          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                  task.status === 'available'
                    ? 'bg-green-100 text-green-700'
                    : task.status === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {task.status === 'available'
                  ? '可接取'
                  : task.status === 'in-progress'
                  ? '进行中'
                  : '已完成'}
              </span>
              <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 任务详情 */}
          <div className="space-y-4">
            {/* 描述 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">任务描述</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
            </div>

            {/* 技能要求 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">技能要求</h4>
              <div className="grid grid-cols-2 gap-2">
                {task.skills.map(({ tag, weight }) => (
                  <div
                    key={tag}
                    className="flex items-center justify-between px-3 py-2 bg-purple-50 rounded"
                  >
                    <span className="text-purple-700 font-medium">{tag}</span>
                    <span className="text-purple-600 text-sm">{weight}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 奖励 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">任务奖励</h4>
              <p className="text-3xl font-bold text-purple-600">
                {task.reward.toLocaleString()} 积分
              </p>
            </div>

            {/* 发布信息 */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>发布人：{publisher?.name || '未知'}</span>
              <span>发布时间：{task.createdAt}</span>
            </div>
          </div>

          {/* 操作按钮 */}
          {canTake && (
            <div className="mt-6">
              <button
                onClick={() => onTake(task.id)}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium
                         hover:bg-purple-700 transition-colors"
              >
                接取任务
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
