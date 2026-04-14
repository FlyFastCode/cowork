import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks, useUsers } from '../../hooks/useData';
import type { Task, SubmissionStatus } from '../../types';
import { TaskSubmissionModal } from './TaskSubmissionModal';
import { SubmissionList } from './SubmissionList';
import { PackageSkillModal } from './PackageSkillModal';
import {
  Briefcase, Users, Clock, CheckCircle, ArrowRight,
  FileText, MessageSquare, Sparkles,
} from 'lucide-react';

const statusBadge: Record<string, { label: string; color: string }> = {
  available: { label: '可领取', color: 'bg-blue-100 text-blue-700' },
  'in-progress': { label: '进行中', color: 'bg-amber-100 text-amber-700' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
  packaged: { label: '已封装', color: 'bg-purple-100 text-purple-700' },
};

export function MyTasksPage() {
  const navigate = useNavigate();
  const { state } = useUsers();
  const {
    publishedBy, assignedTo, joinable,
    addAssignee, addSubmission, updateSubmissionStatus, removeSubmission,
    completeTask, addSkill, updateTaskStatus,
  } = useTasks();
  const currentUser = state.currentUser;

  const [activeTab, setActiveTab] = useState<'published' | 'assigned' | 'joinable'>('assigned');
  const [submissionTask, setSubmissionTask] = useState<Task | null>(null);
  const [submissionsTask, setSubmissionsTask] = useState<Task | null>(null);
  const [packageTask, setPackageTask] = useState<Task | null>(null);

  if (!currentUser) {
    return (
      <div className="text-center py-20 text-gray-400">
        <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>请先选择一个用户身份</p>
      </div>
    );
  }

  const myPublished = publishedBy(currentUser.id);
  const myAssigned = assignedTo(currentUser.id);
  const joinableTasks = joinable;

  const currentTasks = activeTab === 'published'
    ? myPublished
    : activeTab === 'assigned'
    ? myAssigned
    : joinableTasks;

  const handleTakeTask = (task: Task) => {
    addAssignee(task.id, {
      userId: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      weight: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = (submission: Parameters<typeof addSubmission>[1]) => {
    addSubmission(submissionTask!.id, submission);
    setSubmissionTask(null);
  };

  const handleUpdateStatus = (submissionId: string, status: SubmissionStatus) => {
    if (submissionsTask) {
      updateSubmissionStatus(submissionsTask.id, submissionId, status);
    }
  };

  const handleRemoveSubmission = (submissionId: string) => {
    if (submissionsTask) {
      removeSubmission(submissionsTask.id, submissionId);
    }
  };

  const handlePackage = (skill: Parameters<typeof addSkill>[0]) => {
    addSkill(skill);
    updateTaskStatus(packageTask!.id, 'packaged');
    setPackageTask(null);
  };

  const handleComplete = (task: Task) => {
    completeTask(task.id);
  };

  const tabs = [
    { key: 'assigned' as const, label: '我参与的', icon: Users, count: myAssigned.length },
    { key: 'published' as const, label: '我发布的', icon: MessageSquare, count: myPublished.length },
    { key: 'joinable' as const, label: '可加入的', icon: ArrowRight, count: joinableTasks.length },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-xl">
          <Briefcase className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的任务</h1>
          <p className="text-sm text-gray-500">管理你发布和参与的任务</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task list */}
      {currentTasks.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">暂无任务</p>
          {activeTab === 'joinable' && (
            <button
              onClick={() => navigate('/task-plaza')}
              className="mt-3 text-indigo-600 text-sm hover:underline"
            >
              去任务广场看看 →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {currentTasks.map(task => {
            const status = statusBadge[task.status];
            const isAssigned = task.assignees.some(a => a.userId === currentUser.id);
            const isPublisher = task.publisherId === currentUser.id;
            const pendingSubmissions = task.submissions.filter(s => s.status === 'pending').length;

            return (
              <div key={task.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Status + Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-3">{task.description}</p>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>奖励 ¥{task.reward}</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {task.assignees.length}/{task.maxAssignees || 3} 人
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {task.submissions.length} 条提交
                      </span>
                      {pendingSubmissions > 0 && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Clock className="w-3 h-3" />
                          {pendingSubmissions} 条待审核
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Assignee avatars */}
                  <div className="flex items-center -space-x-2 flex-shrink-0">
                    {task.assignees.slice(0, 3).map(a => (
                      <img
                        key={a.userId}
                        src={a.avatar}
                        alt={a.name}
                        title={a.name}
                        className="w-8 h-8 rounded-full border-2 border-white bg-gray-100"
                      />
                    ))}
                    {task.assignees.length > 3 && (
                      <span className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500">
                        +{task.assignees.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                  {task.status === 'available' && (
                    <button
                      onClick={() => handleTakeTask(task)}
                      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      领取任务
                    </button>
                  )}
                  {task.status === 'in-progress' && isAssigned && (
                    <>
                      <button
                        onClick={() => setSubmissionTask(task)}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        提交成果
                      </button>
                      <button
                        onClick={() => setSubmissionsTask(task)}
                        className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        查看提交
                      </button>
                    </>
                  )}
                  {task.status === 'in-progress' && isPublisher && (
                    <>
                      <button
                        onClick={() => setSubmissionsTask(task)}
                        className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        审核提交 ({pendingSubmissions})
                      </button>
                      <button
                        onClick={() => handleComplete(task)}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        标记完成
                      </button>
                    </>
                  )}
                  {task.status === 'completed' && isPublisher && (
                    <button
                      onClick={() => setPackageTask(task)}
                      className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      封装为 Skill
                    </button>
                  )}
                  {task.status === 'packaged' && (
                    <span className="text-xs text-purple-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      已封装为 Skill
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {submissionTask && (
        <TaskSubmissionModal
          task={submissionTask}
          onClose={() => setSubmissionTask(null)}
          onSubmit={handleSubmit}
        />
      )}
      {submissionsTask && (
        <SubmissionList
          task={submissionsTask}
          onClose={() => setSubmissionsTask(null)}
          onUpdateStatus={handleUpdateStatus}
          onRemove={handleRemoveSubmission}
        />
      )}
      {packageTask && (
        <PackageSkillModal
          task={packageTask}
          onClose={() => setPackageTask(null)}
          onPackage={handlePackage}
        />
      )}
    </div>
  );
}
