import { useState } from 'react';
import type { Task, SubmissionType, TaskSubmission } from '../../types';
import { X, Code, FileText, Palette } from 'lucide-react';
import { useUsers } from '../../hooks/useData';

interface TaskSubmissionModalProps {
  task: Task;
  onClose: () => void;
  onSubmit: (submission: TaskSubmission) => void;
}

const typeOptions: { value: SubmissionType; label: string; icon: typeof Code; placeholder: string }[] = [
  {
    value: 'code',
    label: '代码',
    icon: Code,
    placeholder: '描述你提交的代码内容，例如：实现了用户登录模块，包含 JWT 认证和错误处理...',
  },
  {
    value: 'text',
    label: '文本',
    icon: FileText,
    placeholder: '描述你提交的文本内容，例如：完成了第1-5章小说初稿，约2万字...',
  },
  {
    value: 'design',
    label: '设计',
    icon: Palette,
    placeholder: '描述你提交的设计内容，例如：完成了首页 UI 设计稿，包含移动端适配方案...',
  },
];

export function TaskSubmissionModal({ task, onClose, onSubmit }: TaskSubmissionModalProps) {
  const { currentUser } = useUsers();
  const [selectedType, setSelectedType] = useState<SubmissionType>('text');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  if (!currentUser) return null;

  const currentType = typeOptions.find(o => o.value === selectedType)!;
  const userSubmissions = task.submissions.filter(s => s.userId === currentUser.id);
  const version = userSubmissions.length + 1;

  const handleSubmit = () => {
    if (!content.trim()) {
      setError('请输入提交内容');
      return;
    }
    if (content.trim().length < 10) {
      setError('提交内容至少 10 个字符');
      return;
    }

    const submission: TaskSubmission = {
      id: `sub-${Date.now()}`,
      taskId: task.id,
      userId: currentUser.id,
      userName: currentUser.name,
      content: content.trim(),
      type: selectedType,
      status: 'pending',
      timestamp: new Date().toISOString().split('T')[0],
      version,
    };

    onSubmit(submission);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">提交成果</h2>
            <p className="text-sm text-gray-500 mt-0.5">{task.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Type selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">提交类型</label>
            <div className="flex gap-2">
              {typeOptions.map(option => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedType(option.value)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedType === option.value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Version info */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">版本</span>
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">v{version}</span>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentType.label}内容描述
            </label>
            <textarea
              value={content}
              onChange={e => { setContent(e.target.value); setError(''); }}
              placeholder={currentType.placeholder}
              rows={6}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <p className="text-xs text-gray-400 mt-1">{content.length} 字符</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            提交
          </button>
        </div>
      </div>
    </div>
  );
}
