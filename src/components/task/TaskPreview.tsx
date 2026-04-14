import type { SkillTag } from '../../types';

interface TaskPreviewProps {
  task: {
    title: string;
    description: string;
    skills: { tag: SkillTag; weight: number }[];
    reward: number;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export function TaskPreview({ task, onConfirm, onCancel }: TaskPreviewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">任务预览</h2>

          <div className="space-y-4">
            {/* 任务标题 */}
            <div>
              <h3 className="text-lg font-semibold text-purple-600">{task.title}</h3>
            </div>

            {/* 任务描述 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">任务描述</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
            </div>

            {/* 技能要求 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">技能要求</h4>
              <div className="flex flex-wrap gap-2">
                {task.skills.map(({ tag, weight }) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {tag}: {weight}%
                  </span>
                ))}
              </div>
            </div>

            {/* 奖励 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">任务奖励</h4>
              <p className="text-2xl font-bold text-purple-600">{task.reward.toLocaleString()} 积分</p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium
                       text-gray-700 hover:bg-gray-50 transition-colors"
            >
              返回修改
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium
                       hover:bg-purple-700 transition-colors"
            >
              确认发布
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
