import { X, Users } from 'lucide-react';
import type { Task, User } from '../../types';
import { useUsers } from '../../hooks/useData';

interface TaskDetailModalProps {
  task: Task;
  publisher?: User | null;
  onClose: () => void;
  onTake: (taskId: string) => void;
  onJoin: (taskId: string) => void;
}

export function TaskDetailModal({ task, publisher, onClose, onTake, onJoin }: TaskDetailModalProps) {
  const { state } = useUsers();
  const currentUser = state.currentUser;
  const isAlreadyAssignee = task.assignees.some(a => a.userId === currentUser?.id);
  const canTake = task.status === 'available';
  const canJoin = task.status === 'in-progress' && task.assignees.length < (task.maxAssignees || 3);

  const statusLabel: Record<string, { text: string; cls: string }> = {
    available: { text: '可接取', cls: 'bg-green-100 text-green-700' },
    'in-progress': { text: '进行中', cls: 'bg-yellow-100 text-yellow-700' },
    completed: { text: '已完成', cls: 'bg-gray-100 text-gray-700' },
    packaged: { text: '已封装', cls: 'bg-purple-100 text-purple-700' },
  };

  const statusInfo = statusLabel[task.status] || statusLabel.available;

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
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${statusInfo.cls}`}>
                {statusInfo.text}
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

            {/* 协作成员 */}
            {task.assignees.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    协作成员 ({task.assignees.length}/{task.maxAssignees || 3})
                  </span>
                </h4>
                <div className="flex items-center gap-3 flex-wrap">
                  {task.assignees.map(a => (
                    <div key={a.userId} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <img src={a.avatar} alt={a.name} className="w-6 h-6 rounded-full bg-gray-200" />
                      <span className="text-sm text-gray-700">{a.name}</span>
                      {a.weight > 0 && (
                        <span className="text-xs text-gray-400">{a.weight}%</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 提交记录 */}
            {task.submissions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">提交记录</h4>
                <p className="text-sm text-gray-500">共 {task.submissions.length} 条提交，{task.contributors.length} 位贡献者</p>
              </div>
            )}

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
          <div className="mt-6">
            {canTake && currentUser && (
              <button
                onClick={() => onTake(task.id)}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium
                         hover:bg-purple-700 transition-colors"
              >
                领取任务
              </button>
            )}
            {canJoin && currentUser && !isAlreadyAssignee && (
              <button
                onClick={() => onJoin(task.id)}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium
                         hover:bg-indigo-700 transition-colors"
              >
                加入协作
              </button>
            )}
            {isAlreadyAssignee && task.status === 'in-progress' && (
              <div className="text-center py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg">
                你已参与此任务
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
