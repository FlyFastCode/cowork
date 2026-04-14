import { useMemo, useState } from 'react';
import { useTasks, useUsers, useAchievements } from '../../hooks/useData';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Radar,
} from 'recharts';
import { Target, Trophy } from 'lucide-react';
import type { Task } from '../../types';

export function TaskMatchingPage() {
  const { tasks } = useTasks();
  const { getUserById } = useUsers();
  const { achievements } = useAchievements();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 计算匹配分数
  const calculateMatchScore = (task: Task) => {
    if (!achievements) return 0;

    let score = 0;
    task.skills.forEach(({ tag, weight }) => {
      const userAchievement = achievements.byCategory[tag] || 0;
      // 匹配分 = 任务权重 * 用户成就值 / 1000 (归一化)
      score += weight * (userAchievement / 1000);
    });
    return Math.round(score);
  };

  // 带有匹配分数的任务列表
  const tasksWithScore = useMemo(() => {
    return tasks
      .filter((t: Task) => t.status === 'available')
      .map((task: Task) => ({
        ...task,
        matchScore: calculateMatchScore(task),
      }))
      .sort((a: Task & { matchScore: number }, b: Task & { matchScore: number }) => b.matchScore - a.matchScore);
  }, [tasks, achievements]);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">任务匹配</h1>

      {/* 用户能力概览 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">我的能力图谱</h2>
        {achievements ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={Object.entries(achievements.byCategory).map(([name, value]) => ({
                    subject: name,
                    value,
                  }))}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                  <Radar
                    name="我的能力"
                    dataKey="value"
                    stroke="#9333ea"
                    fill="#9333ea"
                    fillOpacity={0.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-purple-600" />
                <span className="text-lg font-semibold text-gray-900">
                  总成就值：{achievements.total.toLocaleString()}
                </span>
              </div>
              <div className="space-y-2">
                {Object.entries(achievements.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([category, value]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-gray-700">{category}</span>
                      <span className="font-semibold text-purple-600">{value.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12">请先登录</p>
        )}
      </div>

      {/* 推荐任务 */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">推荐任务</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasksWithScore.map((task: Task & { matchScore: number }) => (
          <div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer
                     hover:shadow-xl transition-all"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{task.title}</h3>
                  <p className="text-sm text-gray-500">发布人：{getUserById(task.publisherId!)?.name || '未知'}</p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  <Target className="w-4 h-4" />
                  <span className="font-bold">{task.matchScore}</span>
                  <span className="text-xs">匹配分</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

              {/* 技能要求 */}
              <div className="flex flex-wrap gap-1 mb-4">
                {task.skills.slice(0, 4).map(({ tag, weight }) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs"
                  >
                    {tag}: {weight}%
                  </span>
                ))}
              </div>

              {/* 奖励 */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-1 text-purple-600 font-bold">
                  <Trophy className="w-5 h-5" />
                  <span>{task.reward.toLocaleString()} 积分</span>
                </div>
                <span className="text-sm text-gray-500">{task.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasksWithScore.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无可匹配的任务</p>
        </div>
      )}

      {/* 任务详情弹窗 */}
      {selectedTask && (
        <TaskMatchingDetail
          task={selectedTask}
          matchScore={calculateMatchScore(selectedTask)}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

interface TaskMatchingDetailProps {
  task: Task;
  matchScore: number;
  onClose: () => void;
}

function TaskMatchingDetail({ task, matchScore, onClose }: TaskMatchingDetailProps) {
  const { achievements } = useAchievements();

  // 准备对比数据
  const radarData = task.skills.map(({ tag, weight }) => ({
    subject: tag,
    task: weight * 50, // 任务需求（按权重换算）
    user: achievements?.byCategory[tag] || 0,
  }));

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  匹配分数：{matchScore}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 能力对比雷达图 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">能力匹配度</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                    <Radar
                      name="任务需求"
                      dataKey="task"
                      stroke="#7c3aed"
                      fill="#7c3aed"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="我的能力"
                      dataKey="user"
                      stroke="#059669"
                      fill="#059669"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-600 rounded-full opacity-50" />
                  <span className="text-sm text-gray-600">任务需求</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full opacity-50" />
                  <span className="text-sm text-gray-600">我的能力</span>
                </div>
              </div>
            </div>

            {/* 任务详情 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">任务详情</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">描述</h4>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">奖励</h4>
                  <p className="text-2xl font-bold text-purple-600">{task.reward.toLocaleString()} 积分</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">技能要求</h4>
                  <div className="space-y-2">
                    {task.skills.map(({ tag, weight }) => (
                      <div key={tag} className="flex items-center justify-between">
                        <span className="text-gray-700">{tag}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600"
                              style={{ width: `${weight}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-purple-600">{weight}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
            申请接取此任务
          </button>
        </div>
      </div>
    </div>
  );
}
