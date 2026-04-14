既然你打算先做一个**前端 Demo**，并使用 `localStorage` 来模拟整个后端逻辑，那我们需要将上述复杂的分布式系统抽象为一套**前端状态管理模型**。

这个 Demo 的核心目标是演示：**任务发布 -> 自动权重计算 -> 匹配 -> 协作提交 -> 成果封装（Skill）-> 收益分润**。

---

## 📅 前端 Demo 开发计划

### 第一阶段：数据模型设计 (Data Schema)
在 `localStorage` 中模拟四张核心表。

* **Users 表**：存储 `id`、`name`、`achievements`（对象，包含不同维度分值）。
* **Tasks 表**：存储 `id`、`title`、`description`、`weights`（权重对象）、`status`、`commits`（数组）。
* **Skills 表**：存储 `id`、`name`、`shares`（股份比例对象）、`price`、`callCount`。
* **Ledger 表**：存储流水记录，用于演示分润。

### 第二阶段：核心功能模块实现

#### 1. 任务发布与“AI 自动权重” (Mock LLM)
* **功能**：用户输入描述，点击“分析”。
* **实现**：前端写一个简单的关键词匹配函数（模拟 AI），识别关键词（如 "React", "小说", "Python"），自动生成权重并渲染**雷达图**（推荐使用 Chart.js 或 ECharts）。

#### 2. 匹配与“OpenClaw”模拟
* **功能**：点击“匹配”，系统弹出当前最合适的 3 个用户。
* **实现**：编写一个 `matchingScore` 函数，遍历 Users 表，计算向量点积。

#### 3. 任务提交与版本管理
* **功能**：模拟不同环节的提交，支持“回滚”。
* **实现**：点击提交时，向该 Task 的 `commits` 数组 push 一个对象。回滚操作即删除数组最后几个元素。

#### 4. Skill 封装与自动分润界面
* **功能**：任务完成后，点击“一键封装 Skill”，设定单次调用费。
* **实现**：根据 `commits` 里的贡献者名单，按权重生成 `shares`。演示“调用一次”后，各用户余额的变化。

---

## 🛠 技术栈建议
* **框架**：Vue 3 或 React（利用响应式数据方便观察 `localStorage` 变化）。
* **UI 组件库**：Ant Design 或 Element Plus（自带描述列表和进度条，适合做后台感强的 Demo）。
* **图表**：**Chart.js**（展示技能雷达图）。
* **持久化**：自定义一个 `useStorage` 钩子，统一读写 `localStorage`。

---

## 📝 Demo 演示流程（脚本示例）

| 步骤 | 操作 | 预期演示效果 |
| :--- | :--- | :--- |
| **1. 设值** | 初始化 3 个测试用户。 | 用户 A 有 800 React 分，用户 B 有 900 创作分。 |
| **2. 发布** | 输入“写一个 React 小说阅读器”。 | **雷达图**自动跳出：React 70%, 创作 30%。 |
| **3. 匹配** | 点击匹配。 | 系统推荐用户 A 为主开发，用户 B 为文案。 |
| **4. 提交** | 模拟 A 和 B 分别提交了代码和文本。 | 任务详情页出现两个 **Commit 记录**。 |
| **5. 转化** | 点击“封装为 Skill”。 | 商城出现新 Skill，**股权明细**显示 A 占 70%，B 占 30%。 |
| **6. 获利** | 点击“模拟调用 10 次”。 | 用户 A 余额增加 `$7`，用户 B 增加 `$3`（假设单次 $1）。 |

---

## 💡 关键代码片段示例 (TypeScript)

```typescript
// 模拟权重自动计算
const analyzeWeights = (desc: string) => {
  const weights = { react: 0, creative: 0, python: 0 };
  if (desc.includes('React')) weights.react = 0.7;
  if (desc.includes('小说')) weights.creative = 0.3;
  // 归一化处理...
  return weights;
};

// 模拟分润逻辑
const distributeRevenue = (skillId: string, totalAmount: number) => {
  const skill = skills.find(s => s.id === skillId);
  const platformFee = 0.1; // 平台抽成 10%
  const netAmount = totalAmount * (1 - platformFee);

  Object.entries(skill.shares).forEach(([userId, share]) => {
    users[userId].balance += netAmount * share;
  });
};
```



这个 Demo 做好后，你可以非常直观地向别人展示：**在这个闭环里，数据是怎么变成钱的。**

你准备先从哪个页面开始写？是先写“任务发布页”还是“个人成就画像页”？
