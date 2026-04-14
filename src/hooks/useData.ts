import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { SkillTag, TaskStatus, User, Task, Skill } from '../types';

/**
 * 自定义 Hooks 用于数据访问
 * 封装常用的数据查询和操作逻辑
 */

// 任务相关 Hooks
export function useTasks() {
  const { state, addTask, updateTask, updateTaskStatus } = useApp();

  const tasksByStatus = useMemo(
    () => (status: TaskStatus) =>
      state.tasks.filter((t: Task) => t.status === status),
    [state.tasks]
  );

  const tasksByTag = useMemo(
    () => (tag: SkillTag) =>
      state.tasks.filter((t: Task) => t.tags.includes(tag)),
    [state.tasks]
  );

  const getTaskById = useMemo(
    () => (id: string) => state.tasks.find((t: Task) => t.id === id),
    [state.tasks]
  );

  const searchTasks = useMemo(
    () => (keyword: string) =>
      state.tasks.filter(
        (t: Task) =>
          t.title.toLowerCase().includes(keyword.toLowerCase()) ||
          t.description.toLowerCase().includes(keyword.toLowerCase())
      ),
    [state.tasks]
  );

  return {
    tasks: state.tasks,
    addTask,
    updateTask,
    updateTaskStatus,
    tasksByStatus,
    tasksByTag,
    getTaskById,
    searchTasks,
  };
}

// 用户相关 Hooks
export function useUsers() {
  const { state, updateUser, setCurrentUser } = useApp();

  const sortedByTotalAchievement = useMemo(
    () =>
      [...state.users].sort((a: User, b: User) => b.achievements.total - a.achievements.total),
    [state.users]
  );

  const sortedByCategory = useMemo(
    () => (category: string) =>
      [...state.users].sort(
        (a: User, b: User) =>
          (b.achievements.byCategory[category] || 0) -
          (a.achievements.byCategory[category] || 0)
      ),
    [state.users]
  );

  const getUserById = useMemo(
    () => (id: string) => state.users.find((u: User) => u.id === id),
    [state.users]
  );

  const topUsers = useMemo(
    () => sortedByTotalAchievement.slice(0, 3),
    [sortedByTotalAchievement]
  );

  return {
    users: state.users,
    currentUser: state.currentUser,
    updateUser,
    setCurrentUser,
    sortedByTotalAchievement,
    sortedByCategory,
    getUserById,
    topUsers,
  };
}

// Skill 相关 Hooks
export function useSkills() {
  const { state, updateSkill } = useApp();

  const sortedByRating = useMemo(
    () => [...state.skills].sort((a: Skill, b: Skill) => b.rating - a.rating),
    [state.skills]
  );

  const sortedByCalls = useMemo(
    () => [...state.skills].sort((a: Skill, b: Skill) => b.totalCalls - a.totalCalls),
    [state.skills]
  );

  const sortedByRevenue = useMemo(
    () => [...state.skills].sort((a: Skill, b: Skill) => b.totalRevenue - a.totalRevenue),
    [state.skills]
  );

  const getSkillById = useMemo(
    () => (id: string) => state.skills.find((s: Skill) => s.id === id),
    [state.skills]
  );

  const skillsByCategory = useMemo(
    () => (category: string) =>
      state.skills.filter((s: Skill) => s.category === category),
    [state.skills]
  );

  return {
    skills: state.skills,
    updateSkill,
    sortedByRating,
    sortedByCalls,
    sortedByRevenue,
    getSkillById,
    skillsByCategory,
  };
}

// 成就值相关 Hooks
export function useAchievements() {
  const { state } = useApp();

  const currentUserAchievements = state.currentUser?.achievements;

  const achievementRank = useMemo(() => {
    if (!state.currentUser) return null;

    const sortedUsers = [...state.users].sort(
      (a: User, b: User) => b.achievements.total - a.achievements.total
    );
    const rank = sortedUsers.findIndex((u: User) => u.id === state.currentUser?.id) + 1;

    return {
      total: rank,
      totalPercentile: ((state.users.length - rank) / state.users.length) * 100,
    };
  }, [state.currentUser, state.users]);

  return {
    achievements: currentUserAchievements,
    rank: achievementRank,
  };
}

// 统计数据 Hooks
export function useStats() {
  const { state } = useApp();

  const taskStats = useMemo(
    () => ({
      total: state.tasks.length,
      available: state.tasks.filter((t: Task) => t.status === 'available').length,
      inProgress: state.tasks.filter((t: Task) => t.status === 'in-progress').length,
      completed: state.tasks.filter((t: Task) => t.status === 'completed').length,
    }),
    [state.tasks]
  );

  const skillStats = useMemo(
    () => ({
      total: state.skills.length,
      totalRevenue: state.skills.reduce((sum: number, s: Skill) => sum + s.totalRevenue, 0),
      totalCalls: state.skills.reduce((sum: number, s: Skill) => sum + s.totalCalls, 0),
      avgRating:
        state.skills.reduce((sum: number, s: Skill) => sum + s.rating, 0) / state.skills.length,
    }),
    [state.skills]
  );

  const userStats = useMemo(
    () => ({
      total: state.users.length,
      avgAchievement:
        state.users.reduce((sum: number, u: User) => sum + u.achievements.total, 0) /
        state.users.length,
    }),
    [state.users]
  );

  return {
    taskStats,
    skillStats,
    userStats,
  };
}
