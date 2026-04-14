import type { Task, SubmissionStatus } from '../../types';
import { Code, FileText, Palette, CheckCircle, XCircle, Clock, Trash2, ArrowLeft } from 'lucide-react';
import { useUsers } from '../../hooks/useData';

interface SubmissionListProps {
  task: Task;
  onClose: () => void;
  onUpdateStatus?: (submissionId: string, status: SubmissionStatus) => void;
  onRemove?: (submissionId: string) => void;
}

const statusConfig: Record<SubmissionStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: '待审核', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: '已通过', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const typeConfig: Record<string, { label: string; icon: typeof Code; color: string }> = {
  code: { label: '代码', icon: Code, color: 'bg-blue-100 text-blue-700' },
  text: { label: '文本', icon: FileText, color: 'bg-purple-100 text-purple-700' },
  design: { label: '设计', icon: Palette, color: 'bg-pink-100 text-pink-700' },
};

export function SubmissionList({ task, onClose, onUpdateStatus, onRemove }: SubmissionListProps) {
  const { currentUser } = useUsers();
  const isPublisher = task.publisherId === currentUser?.id;
  const submissions = [...task.submissions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">提交记录</h2>
              <p className="text-sm text-gray-500">{task.title}</p>
            </div>
          </div>
          <span className="text-sm text-gray-400">共 {submissions.length} 条</span>
        </div>

        {/* Submissions */}
        <div className="p-5">
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">暂无提交记录</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => {
                const typeInfo = typeConfig[sub.type];
                const statusInfo = statusConfig[sub.status];
                const StatusIcon = statusInfo.icon;
                const TypeIcon = typeInfo.icon;

                return (
                  <div key={sub.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                    {/* Header row */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm text-gray-900">{sub.userName}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                        <TypeIcon className="w-3 h-3" />
                        {typeInfo.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                      <span className="ml-auto text-xs text-gray-400 font-mono">v{sub.version}</span>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">
                      {sub.content}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{sub.timestamp}</span>
                      {isPublisher && sub.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onUpdateStatus?.(sub.id, 'rejected')}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <XCircle className="w-3 h-3" />
                            拒绝
                          </button>
                          <button
                            onClick={() => onUpdateStatus?.(sub.id, 'approved')}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-green-600 hover:bg-green-50 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" />
                            通过
                          </button>
                        </div>
                      )}
                      {isPublisher && (
                        <button
                          onClick={() => onRemove?.(sub.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
