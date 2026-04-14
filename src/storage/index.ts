import { STORAGE_KEYS } from '../types';
import type { Task, User, Skill } from '../types';

/**
 * localStorage 存储封装
 * 提供统一的数据存取接口
 */

// 通用存储方法
export const storage = {
  /**
   * 从 localStorage 读取数据
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },

  /**
   * 向 localStorage 写入数据
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },

  /**
   * 从 localStorage 删除数据
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },

  /**
   * 清空所有应用数据
   */
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.TASKS);
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.SKILLS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },
};

// 任务相关操作
export const taskStorage = {
  getAll(): Task[] {
    return storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
  },

  save(tasks: Task[]): void {
    storage.set(STORAGE_KEYS.TASKS, tasks);
  },

  getById(id: string): Task | null {
    const tasks = this.getAll();
    return tasks.find((t) => t.id === id) || null;
  },

  update(task: Task): void {
    const tasks = this.getAll();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      tasks[index] = task;
      this.save(tasks);
    }
  },

  add(task: Task): void {
    const tasks = this.getAll();
    tasks.push(task);
    this.save(tasks);
  },
};

// 用户相关操作
export const userStorage = {
  getAll(): User[] {
    return storage.get<User[]>(STORAGE_KEYS.USERS) || [];
  },

  save(users: User[]): void {
    storage.set(STORAGE_KEYS.USERS, users);
  },

  getById(id: string): User | null {
    const users = this.getAll();
    return users.find((u) => u.id === id) || null;
  },

  update(user: User): void {
    const users = this.getAll();
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      this.save(users);
    }
  },
};

// Skill 相关操作
export const skillStorage = {
  getAll(): Skill[] {
    return storage.get<Skill[]>(STORAGE_KEYS.SKILLS) || [];
  },

  save(skills: Skill[]): void {
    storage.set(STORAGE_KEYS.SKILLS, skills);
  },

  getById(id: string): Skill | null {
    const skills = this.getAll();
    return skills.find((s) => s.id === id) || null;
  },

  update(skill: Skill): void {
    const skills = this.getAll();
    const index = skills.findIndex((s) => s.id === skill.id);
    if (index !== -1) {
      skills[index] = skill;
      this.save(skills);
    }
  },

  add(skill: Skill): void {
    const skills = this.getAll();
    skills.push(skill);
    this.save(skills);
  },
};

// 当前用户相关操作
export const currentUserStorage = {
  get(): User | null {
    return storage.get<User>(STORAGE_KEYS.CURRENT_USER);
  },

  save(user: User): void {
    storage.set(STORAGE_KEYS.CURRENT_USER, user);
  },

  clear(): void {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
  },
};

// 初始化状态
export const initStorage = {
  isInitialized(): boolean {
    return storage.get<boolean>(STORAGE_KEYS.INITIALIZED) === true;
  },

  setInitialized(): void {
    storage.set(STORAGE_KEYS.INITIALIZED, true);
  },
};
