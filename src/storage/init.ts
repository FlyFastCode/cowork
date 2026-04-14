import { initStorage, taskStorage, userStorage, skillStorage, currentUserStorage } from './index';
import { initialTasks, initialUsers, initialSkills } from '../mock/sample-data';

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
