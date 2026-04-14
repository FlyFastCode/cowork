## Why

基于 gemini.md 文档中描述的 AI Agent 人机协作自治平台构想，需要创建一个前端演示 demo 来展示核心交互流程。该 demo 将验证平台概念的可落地性，帮助利益相关者直观理解 Skill 协作、成就值系统、任务匹配和经济激励模型。

## What Changes

- 创建独立的前端演示项目（不包含后端逻辑）
- 实现任务发布界面，支持自然语言描述和技能标签自动分配
- 实现任务匹配展示，显示多维度成就值和技能图谱
- 实现 Skill 商城界面，展示技能共有和收益分配
- 实现成就值系统可视化展示
- 实现任务广场，支持按标签查询和筛选任务
- 实现用户广场，支持按成就值和技能值排名展示

## Capabilities

### New Capabilities
- `task-publishing`: 任务发布界面，支持自然语言输入、技能标签自动提取和权重分配
- `task-matching`: 任务匹配展示，显示用户成就值向量、匹配分数计算和多维度技能图谱
- `skill-marketplace`: Skill 商城界面，展示技能详情、共创持股和收益分配
- `achievement-system`: 成就值系统可视化，展示总成就值和领域成就值雷达图
- `data-storage`: localStorage 数据存储，支持数据持久化、初始化样例数据和重置功能
- `task-plaza`: 任务广场，展示所有可接任务，支持按技能标签筛选和查询
- `user-plaza`: 用户广场，展示用户排名，支持按总成就值和技能领域成就值排序

### Modified Capabilities
<!-- 无修改的现有能力 -->

## Impact

- 新增前端演示项目目录 `frontend-demo/`
- 使用 React + TypeScript 构建
- 使用 TailwindCSS 进行样式设计
- 使用 Recharts 进行数据可视化
- 使用 localStorage 存储数据，提供初始化样例数据
