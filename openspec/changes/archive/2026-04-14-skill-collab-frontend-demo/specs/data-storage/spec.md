## ADDED Requirements

### Requirement: localStorage 数据存储
系统 SHALL 使用浏览器 localStorage 存储所有应用数据。

#### Scenario: 数据持久化
- **WHEN** 用户执行任何数据修改操作（发布任务、购买 Skill 等）
- **THEN** 系统将数据保存到 localStorage，刷新页面后数据不丢失

### Requirement: 初始化样例数据
系统 SHALL 在首次加载时自动写入预定义的样例数据。

#### Scenario: 首次加载初始化
- **WHEN** 应用启动且 localStorage 为空
- **THEN** 系统自动写入样例数据（示例任务、用户成就值、Skill 等）

#### Scenario: 已有数据不重复初始化
- **WHEN** 应用启动且 localStorage 已有数据
- **THEN** 系统直接使用已有数据，不覆盖

### Requirement: 数据重置功能
系统 SHALL 提供重置数据功能，允许用户恢复初始样例数据。

#### Scenario: 重置数据
- **WHEN** 用户点击"重置数据"按钮并确认
- **THEN** 系统清空 localStorage 并重新写入样例数据

### Requirement: 数据类型支持
系统 SHALL 支持存储以下类型的数据：
- 任务列表（tasks）
- 用户成就值（achievements）
- Skill 列表（skills）
- 用户信息（user）

#### Scenario: 分类存储
- **WHEN** 保存数据
- **THEN** 系统按类型分别存储到 localStorage 的不同 key 中

#### Scenario: 数据读取
- **WHEN** 请求某类数据
- **THEN** 系统从 localStorage 对应 key 中读取并解析
