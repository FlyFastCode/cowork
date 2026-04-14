import { initStorage, taskStorage, userStorage, skillStorage, currentUserStorage, storage } from './index';
import { initialTasks, initialUsers, initialSkills } from '../mock/sample-data';
import type { Task } from '../types';
import { STORAGE_KEYS } from '../types';

interface OldTask extends Task {
  assigneeId?: string;
}

/**
 * 数据迁移：将旧版任务数据（assigneeId）迁移到新版（assignees[]）
 */
function migrateTasks(tasks: Task[]): Task[] {
  let changed = false;
  const migrated = tasks.map(task => {
    // 旧版数据使用 assigneeId，新版使用 assignees[]
    const hasOldSchema = 'assigneeId' in task && (task as OldTask).assigneeId && !task.assignees;
    const needsSubmissions = !task.submissions;
    const needsContributors = !task.contributors;
    const needsMaxAssignees = !task.maxAssignees;

    if (hasOldSchema || needsSubmissions || needsContributors || needsMaxAssignees) {
      changed = true;
      const newTask = { ...task } as Task;
      // 迁移 assigneeId -> assignees
      if (hasOldSchema && (task as OldTask).assigneeId) {
        const user = initialUsers.find(u => u.id === (task as OldTask).assigneeId);
        newTask.assignees = [{
          userId: (task as OldTask).assigneeId!,
          name: user?.name || (task as OldTask).assigneeId!,
          avatar: user?.avatar,
          weight: 100,
          joinedAt: task.createdAt,
        }];
      } else if (!newTask.assignees) {
        newTask.assignees = [];
      }
      // 初始化缺失字段
      if (!newTask.submissions) newTask.submissions = [];
      if (!newTask.contributors) newTask.contributors = [];
      if (!newTask.maxAssignees) newTask.maxAssignees = 3;
      return newTask;
    }
    return task;
  });

  if (changed) {
    storage.set<Task[]>(STORAGE_KEYS.TASKS, migrated);
    console.log('Tasks migrated to new schema');
  }

  return migrated;
}

/**
 * 数据初始化逻辑
 * 应用首次启动时自动写入样例数据
 */

export const dataInit = {
  /**
   * 初始化所有数据
   * 如果 localStorage 为空，则写入样例数据
   */
  init(): boolean {
    // 检查是否已经初始化过
    if (initStorage.isInitialized()) {
      // 仍然需要迁移旧数据
      const existingTasks = taskStorage.getAll();
      if (existingTasks.length > 0) {
        migrateTasks(existingTasks);
      }
      console.log('Data already initialized');
      return false;
    }

    // 写入初始数据
    taskStorage.save(initialTasks);
    userStorage.save(initialUsers);
    skillStorage.save(initialSkills);

    // 设置第一个用户为当前用户（演示用）
    currentUserStorage.save(initialUsers[0]);

    // 标记为已初始化
    initStorage.setInitialized();

    console.log('Data initialized successfully');
    return true;
  },

  /**
   * 重置数据为初始状态
   */
  reset(): void {
    // 清空现有数据
    taskStorage.save([]);
    userStorage.save([]);
    skillStorage.save([]);
    currentUserStorage.clear();

    // 移除初始化标记
    initStorage.setInitialized();

    // 重新写入初始数据
    this.init();

    console.log('Data reset to initial state');
  },

  /**
   * 检查是否需要初始化
   */
  needsInit(): boolean {
    return !initStorage.isInitialized();
  },
};
