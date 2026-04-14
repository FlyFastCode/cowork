import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { AppState, Task, User, Skill, TaskStatus, TaskAssignee, TaskSubmission, SubmissionStatus } from '../types';
import { taskStorage, userStorage, skillStorage, currentUserStorage } from '../storage';

// 初始状态
const getInitialState = (): AppState => {
  return {
    tasks: taskStorage.getAll(),
    users: userStorage.getAll(),
    skills: skillStorage.getAll(),
    currentUser: currentUserStorage.get(),
  };
};

// Action 类型
type Action =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'SET_SKILLS'; payload: Skill[] }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'UPDATE_SKILL'; payload: Skill }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'RESET_ALL'; payload: AppState };

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'SET_SKILLS':
      return { ...state, skills: action.payload };
    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] };
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u
        ),
        currentUser:
          state.currentUser?.id === action.payload.id
            ? action.payload
            : state.currentUser,
      };
    case 'RESET_ALL':
      return action.payload;
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addAssignee: (taskId: string, assignee: TaskAssignee) => void;
  removeAssignee: (taskId: string, userId: string) => void;
  addSubmission: (taskId: string, submission: TaskSubmission) => void;
  updateSubmissionStatus: (taskId: string, submissionId: string, status: SubmissionStatus) => void;
  removeSubmission: (taskId: string, submissionId: string) => void;
  completeTask: (taskId: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (skill: Skill) => void;
  setCurrentUser: (user: User | null) => void;
  updateUser: (user: User) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Provider 组件
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // 添加任务
  const addTask = useCallback((task: Task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
    taskStorage.add(task);
  }, []);

  // 更新任务
  const updateTask = useCallback((task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
    taskStorage.update(task);
  }, []);

  // 更新任务状态
  const updateTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      const task = taskStorage.getById(taskId);
      if (task) {
        const updatedTask = { ...task, status };
        dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
        taskStorage.update(updatedTask);
      }
    },
    []
  );

  // 添加协作者
  const addAssignee = useCallback((taskId: string, newAssignee: TaskAssignee) => {
    const task = taskStorage.getById(taskId);
    if (task) {
      const updatedTask = {
        ...task,
        assignees: [...task.assignees, newAssignee],
        status: task.status === 'available' ? ('in-progress' as TaskStatus) : task.status,
      };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      taskStorage.update(updatedTask);
    }
  }, []);

  // 移除协作者
  const removeAssignee = useCallback((taskId: string, userId: string) => {
    const task = taskStorage.getById(taskId);
    if (task) {
      const updatedTask = {
        ...task,
        assignees: task.assignees.filter(a => a.userId !== userId),
      };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      taskStorage.update(updatedTask);
    }
  }, []);

  // 添加提交
  const addSubmission = useCallback((taskId: string, submission: TaskSubmission) => {
    const task = taskStorage.getById(taskId);
    if (task) {
      const updatedTask = {
        ...task,
        submissions: [...task.submissions, submission],
      };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      taskStorage.update(updatedTask);
    }
  }, []);

  // 更新提交状态
  const updateSubmissionStatus = useCallback((taskId: string, submissionId: string, status: SubmissionStatus) => {
    const task = taskStorage.getById(taskId);
    if (task) {
      const updatedSubmissions = task.submissions.map(s =>
        s.id === submissionId ? { ...s, status } : s
      );
      const updatedTask = { ...task, submissions: updatedSubmissions };

      // 如果审核通过，添加该用户到 contributors
      if (status === 'approved') {
        const submission = task.submissions.find(s => s.id === submissionId);
        if (submission && !updatedTask.contributors.includes(submission.userId)) {
          updatedTask.contributors = [...updatedTask.contributors, submission.userId];
        }
      }

      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      taskStorage.update(updatedTask);
    }
  }, []);

  // 删除提交
  const removeSubmission = useCallback((taskId: string, submissionId: string) => {
    const task = taskStorage.getById(taskId);
    if (task) {
      const updatedTask = {
        ...task,
        submissions: task.submissions.filter(s => s.id !== submissionId),
      };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      taskStorage.update(updatedTask);
    }
  }, []);

  // 完成任务
  const completeTask = useCallback((taskId: string) => {
    const task = taskStorage.getById(taskId);
    if (task) {
      const updatedTask = {
        ...task,
        status: 'completed' as TaskStatus,
        completedAt: new Date().toISOString().split('T')[0],
      };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      taskStorage.update(updatedTask);
    }
  }, []);

  // 添加 Skill
  const addSkill = useCallback((skill: Skill) => {
    dispatch({ type: 'ADD_SKILL', payload: skill });
    skillStorage.add(skill);
  }, []);

  // 更新 Skill
  const updateSkill = useCallback((skill: Skill) => {
    dispatch({ type: 'UPDATE_SKILL', payload: skill });
    skillStorage.update(skill);
  }, []);

  // 设置当前用户
  const setCurrentUser = useCallback((user: User | null) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
    if (user) {
      currentUserStorage.save(user);
    } else {
      currentUserStorage.clear();
    }
  }, []);

  // 更新用户
  const updateUser = useCallback((user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
    userStorage.update(user);
  }, []);

  // 重置所有数据
  const resetData = useCallback(() => {
    const newState: AppState = {
      tasks: taskStorage.getAll(),
      users: userStorage.getAll(),
      skills: skillStorage.getAll(),
      currentUser: currentUserStorage.get(),
    };
    dispatch({ type: 'RESET_ALL', payload: newState });
  }, []);

  const value = useMemo(
    () => ({
      state,
      addTask,
      updateTask,
      updateTaskStatus,
      addAssignee,
      removeAssignee,
      addSubmission,
      updateSubmissionStatus,
      removeSubmission,
      completeTask,
      addSkill,
      updateSkill,
      setCurrentUser,
      updateUser,
      resetData,
    }),
    [state, addTask, updateTask, updateTaskStatus, addAssignee, removeAssignee, addSubmission, updateSubmissionStatus, removeSubmission, completeTask, addSkill, updateSkill, setCurrentUser, updateUser, resetData]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
