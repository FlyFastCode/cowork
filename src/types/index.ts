// 技能标签类型
export type SkillTag =
  | 'React'
  | 'TypeScript'
  | 'Node.js'
  | 'Python'
  | 'UI Design'
  | '写作'
  | '视频剪辑'
  | 'TTS'
  | 'FFmpeg'
  | '项目管理'
  | '爬虫'
  | 'API Integration';

// 用户成就值接口
export interface Achievement {
  total: number; // 总成就值
  byCategory: Record<string, number>; // 各领域成就值
  history: AchievementHistory[]; // 成就历史
  rank?: {
    total: number;
    byCategory: Record<string, number>;
  };
}

export interface AchievementHistory {
  date: string;
  source: string;
  category: string;
  amount: number;
}

// 用户接口
export interface User {
  id: string;
  name: string;
  avatar?: string;
  achievements: Achievement;
  skills: SkillTag[];
  createdAt: string;
}

// 任务状态
export type TaskStatus = 'available' | 'in-progress' | 'completed' | 'packaged';

// 提交类型
export type SubmissionType = 'code' | 'text' | 'design';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

// 任务协作者
export interface TaskAssignee {
  userId: string;
  name: string;
  avatar?: string;
  weight: number; // 贡献权重
  joinedAt: string;
}

// 任务提交记录
export interface TaskSubmission {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  content: string;
  type: SubmissionType;
  status: SubmissionStatus;
  timestamp: string;
  version: number;
}

// 任务接口
export interface Task {
  id: string;
  title: string;
  description: string;
  skills: { tag: SkillTag; weight: number }[];
  reward: number;
  status: TaskStatus;
  publisherId?: string;
  publisherName?: string;
  assignees: TaskAssignee[]; // 协作者列表（替代原 assigneeId）
  submissions: TaskSubmission[]; // 提交记录
  contributors: string[]; // 已审核通过的贡献者 ID 列表
  maxAssignees?: number; // 最大协人数，默认 3
  completedAt?: string;
  createdAt: string;
  tags: SkillTag[];
}

// Skill 接口
export interface Skill {
  id: string;
  name: string;
  description: string;
  price: number; // 单次调用价格
  totalCalls: number; // 总调用次数
  rating: number; // 评分 (0-5)
  owners: SkillOwner[]; // 共创股东
  totalRevenue: number; // 总收益
  category: string;
  version: string;
}

export interface SkillOwner {
  userId: string;
  userName: string;
  sharePercentage: number; // 持股比例
  contributionType: '策划' | '开发' | '测试' | '设计';
}

// 任务发布表单
export interface TaskPublishForm {
  description: string;
  skills: { tag: SkillTag; weight: number }[];
  reward: number;
}

// 应用状态接口
export interface AppState {
  tasks: Task[];
  users: User[];
  skills: Skill[];
  currentUser: User | null;
}

// localStorage 键名
export const STORAGE_KEYS = {
  TASKS: 'skill-collab-tasks',
  USERS: 'skill-collab-users',
  SKILLS: 'skill-collab-skills',
  CURRENT_USER: 'skill-collab-current-user',
  INITIALIZED: 'skill-collab-initialized',
} as const;
