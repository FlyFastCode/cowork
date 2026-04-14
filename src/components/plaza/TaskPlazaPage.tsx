import { useState, useMemo } from 'react';
import { useTasks, useUsers } from '../../hooks/useData';
import { TaskCard } from './TaskCard';
import { TagCloud } from './TagCloud';
import { TaskDetailModal } from './TaskDetailModal';
import { Search } from 'lucide-react';
import type { SkillTag, Task, TaskStatus } from '../../types';

export function TaskPlazaPage() {
  const { tasks, addAssignee } = useTasks();
  const { state, getUserById } = useUsers();
  const [selectedTag, setSelectedTag] = useState<SkillTag | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  const currentUser = state.currentUser;

  // 获取所有标签
  const allTags = useMemo(() => {
    const tags = new Set<SkillTag>();
    tasks.forEach((t: Task) => t.tags.forEach((tag: SkillTag) => tags.add(tag)));
    return Array.from(tags);
  }, [tasks]);

  // 过滤任务
  const filteredTasks = useMemo(() => {
    return tasks.filter((task: Task) => {
      // 状态过滤 (don't show packaged tasks in plaza)
      if (task.status === 'packaged') return false;
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }
      // 标签过滤
      if (selectedTag && !task.tags.includes(selectedTag)) {
        return false;
      }
      // 关键词搜索
      if (searchKeyword) {
        const lowerKeyword = searchKeyword.toLowerCase();
        return (
          task.title.toLowerCase().includes(lowerKeyword) ||
          task.description.toLowerCase().includes(lowerKeyword)
        );
      }
      return true;
    });
  }, [tasks, selectedTag, searchKeyword, statusFilter]);

  // 接取任务
  const handleTakeTask = (taskId: string) => {
    if (!currentUser) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    if (task.assignees.some(a => a.userId === currentUser.id)) return;
    if (task.assignees.length >= (task.maxAssignees || 3)) return;

    addAssignee(taskId, {
      userId: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      weight: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    });
    // Refresh selected task
    setSelectedTask(tasks.find(t => t.id === taskId) || null);
  };

  // 加入协作
  const handleJoinTask = (taskId: string) => {
    handleTakeTask(taskId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">任务广场</h1>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索任务..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* 状态筛选 */}
          <div className="flex gap-2">
            {(['all', 'available', 'in-progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' && '全部'}
                {status === 'available' && '可接取'}
                {status === 'in-progress' && '进行中'}
                {status === 'completed' && '已完成'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 标签云筛选 */}
      <TagCloud
        tags={allTags}
        selectedTag={selectedTag}
        onSelect={setSelectedTag}
        onClear={() => setSelectedTag(null)}
      />

      {/* 任务列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredTasks.map((task: Task) => (
          <TaskCard
            key={task.id}
            task={task}
            publisher={task.publisherId ? getUserById(task.publisherId) : undefined}
            onClick={() => setSelectedTask(task)}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">没有找到符合条件的任务</p>
        </div>
      )}

      {/* 任务详情弹窗 */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          publisher={selectedTask.publisherId ? getUserById(selectedTask.publisherId) : undefined}
          onClose={() => setSelectedTask(null)}
          onTake={handleTakeTask}
          onJoin={handleJoinTask}
        />
      )}
    </div>
  );
}
