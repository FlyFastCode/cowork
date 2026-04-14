import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutGrid,
  PlusCircle,
  Target,
  Users,
  ShoppingBag,
  Trophy,
  Settings,
  GitCompare,
  Briefcase,
} from 'lucide-react';
import { ResetDataButton } from '../common/ResetDataButton';
import { UserSwitcher } from '../common/UserSwitcher';

export function MainLayout() {
  const navItems = [
    { path: '/', icon: LayoutGrid, label: '首页' },
    { path: '/task-publish', icon: PlusCircle, label: '发布' },
    { path: '/task-plaza', icon: Target, label: '任务广场' },
    { path: '/my-tasks', icon: Briefcase, label: '我的任务' },
    { path: '/task-matching', icon: GitCompare, label: '任务匹配' },
    { path: '/user-plaza', icon: Users, label: '用户广场' },
    { path: '/marketplace', icon: ShoppingBag, label: 'Skill 商城' },
    { path: '/achievement', icon: Trophy, label: '成就值' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg" />
              <span className="text-xl font-bold text-gray-900">SkillCollab</span>
            </div>

            {/* 导航菜单 */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            {/* 右侧操作 */}
            <div className="flex items-center gap-2">
              <UserSwitcher />
              <ResetDataButton />
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 移动端导航 */}
        <nav className="lg:hidden flex items-center justify-around py-2 border-t bg-white overflow-x-auto">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors min-w-[3rem] ${
                  isActive
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-500 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{label}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>SkillCollab Demo - 基于 AI Agent 的人机协作自治平台演示</p>
          <p className="mt-1">演示数据仅用于展示，刷新页面后保留</p>
        </div>
      </footer>
    </div>
  );
}
