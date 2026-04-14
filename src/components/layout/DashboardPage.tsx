import { PlusCircle, Target, Users, ShoppingBag, Trophy, ArrowRight, Briefcase, GitCompare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStats, useUsers } from '../../hooks/useData';

export function DashboardPage() {
  const navigate = useNavigate();
  const stats = useStats();
  const { state } = useUsers();
  const currentUser = state.currentUser;

  const cards = [
    {
      title: '发布任务',
      description: '用自然语言描述任务，AI 自动分析技能需求',
      icon: PlusCircle,
      color: 'from-purple-500 to-indigo-600',
      path: '/task-publish',
      stats: `${stats.taskStats.available} 个可接取任务`,
    },
    {
      title: '任务广场',
      description: '浏览和接取适合你的任务',
      icon: Target,
      color: 'from-blue-500 to-cyan-600',
      path: '/task-plaza',
      stats: `${stats.taskStats.total} 个总任务`,
    },
    {
      title: '我的任务',
      description: '管理你发布和参与的任务，提交成果',
      icon: Briefcase,
      color: 'from-indigo-500 to-violet-600',
      path: '/my-tasks',
      stats: `${stats.taskStats.inProgress} 个进行中`,
    },
    {
      title: '任务匹配',
      description: '查看与你技能最匹配的任务',
      icon: GitCompare,
      color: 'from-teal-500 to-green-600',
      path: '/task-matching',
      stats: `${stats.taskStats.available} 个可匹配任务`,
    },
    {
      title: '用户广场',
      description: '查看成就排行榜，发现领域专家',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      path: '/user-plaza',
      stats: `${stats.userStats.total} 位用户`,
    },
    {
      title: 'Skill 商城',
      description: '购买和共创技能插件',
      icon: ShoppingBag,
      color: 'from-orange-500 to-red-600',
      path: '/marketplace',
      stats: `${stats.skillStats.total} 个技能`,
    },
    {
      title: '成就值',
      description: '查看你的技能图谱和成长轨迹',
      icon: Trophy,
      color: 'from-pink-500 to-rose-600',
      path: '/achievement',
      stats: `平均 ${Math.round(stats.userStats.avgAchievement)} 分`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* 欢迎区域 */}
      <div className="text-center mb-12">
        {/* Current user indicator */}
        {currentUser && (
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border mb-6">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full bg-gray-100" />
            <span className="text-sm text-gray-600">当前用户：</span>
            <span className="text-sm font-semibold text-gray-900">{currentUser.name}</span>
            <span className="text-xs text-gray-400">（可在右上角切换）</span>
          </div>
        )}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          欢迎使用 SkillCollab
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          基于 AI Agent 的人机协作自治平台演示
          <br />
          发布任务、接取工作、共创技能、积累成就
        </p>
      </div>

      {/* 功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl
                       transition-all cursor-pointer group"
            >
              <div className={`h-2 bg-gradient-to-r ${card.color}`} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color}
                             flex items-center justify-center text-white`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <div className="text-sm text-purple-600 font-medium">
                  {card.stats}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 快捷提示 */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          快速开始
        </h2>
        <p className="text-gray-600">
          当前为演示模式，数据存储在本地浏览器中
          <br />
          刷新页面数据不会丢失，点击底部"重置数据"可恢复初始状态
        </p>
      </div>
    </div>
  );
}
