## ADDED Requirements

### Requirement: Skill 列表展示
系统 SHALL 展示商城中可用的 Skill 列表，包含基本信息和统计信息。

#### Scenario: 浏览 Skill 列表
- **WHEN** 用户访问商城页面
- **THEN** 系统以卡片网格形式展示所有 Skill

#### Scenario: Skill 排序
- **WHEN** 用户选择排序方式（热度、评分、价格）
- **THEN** 系统按选定方式重新排列 Skill 列表

### Requirement: Skill 详情展示
系统 SHALL 展示 Skill 的详细信息，包括描述、调用量、评分等。

#### Scenario: 查看详情
- **WHEN** 用户点击某个 Skill 卡片
- **THEN** 系统展示完整详情，包括描述、调用量、用户评分

### Requirement: 共创持股信息展示
系统 SHALL 展示 Skill 的共创股东信息和分配比例。

#### Scenario: 展示持股列表
- **WHEN** 用户查看 Skill 详情
- **THEN** 系统展示所有持股人及其持股比例

#### Scenario: 贡献类型标识
- **WHEN** 展示持股信息
- **THEN** 系统标识每个持股人的贡献类型（策划、开发、测试等）

### Requirement: 收益分配展示
系统 SHALL 展示 Skill 的收益情况和分配明细。

#### Scenario: 展示收益数据
- **WHEN** 用户查看 Skill 收益信息
- **THEN** 系统展示总收益、单次调用价格和每人分润

#### Scenario: 收益趋势图表
- **WHEN** 用户查看收益详情
- **THEN** 系统以折线图展示收益趋势

### Requirement: Skill 购买/调用
系统 SHALL 提供购买或调用 Skill 的交互界面。

#### Scenario: 购买 Skill
- **WHEN** 用户点击"购买"按钮
- **THEN** 系统显示确认对话框，确认后完成购买

#### Scenario: 试用 Skill
- **WHEN** 用户点击"试用"按钮
- **THEN** 系统提供有限次数的试用体验
