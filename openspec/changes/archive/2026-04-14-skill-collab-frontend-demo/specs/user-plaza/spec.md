## ADDED Requirements

### Requirement: 用户列表展示
系统 SHALL 展示所有用户的列表，包含用户基本信息和成就值。

#### Scenario: 浏览用户列表
- **WHEN** 用户访问用户广场页面
- **THEN** 系统以列表形式展示所有用户，显示头像、昵称、总成就值

### Requirement: 按总成就值排名
系统 SHALL 支持按总成就值对用户进行排序。

#### Scenario: 总排名排序
- **WHEN** 用户选择"总成就值"排序
- **THEN** 系统按总成就值从高到低展示用户排名

#### Scenario: 排名标识
- **WHEN** 展示用户列表
- **THEN** 系统为前 3 名用户显示金/银/铜牌标识

### Requirement: 按技能领域成就值排名
系统 SHALL 支持按特定技能领域的成就值对用户进行排序。

#### Scenario: 选择技能领域排序
- **WHEN** 用户选择某个技能领域（如 React、写作）
- **THEN** 系统按该领域成就值从高到低展示用户排名

#### Scenario: 领域切换
- **WHEN** 用户切换不同的技能领域
- **THEN** 系统刷新排名列表，显示对应领域的成就值

### Requirement: 用户详情查看
系统 SHALL 允许用户查看其他用户的详情。

#### Scenario: 查看详情
- **WHEN** 用户点击某个用户
- **THEN** 系统展示该用户的详细信息，包括技能雷达图、成就历史、参与任务等

#### Scenario: 查看用户 Skill
- **WHEN** 查看用户详情
- **THEN** 系统展示该用户共创或拥有的 Skill 列表

### Requirement: 初始化用户样例数据
系统 SHALL 提供至少 10 个用户的样例数据用于演示。

#### Scenario: 初始数据加载
- **WHEN** 应用首次加载且 localStorage 为空
- **THEN** 系统写入预设的用户数据，包含不同的成就值和技能专长

#### Scenario: 多样化数据
- **WHEN** 生成样例数据
- **THEN** 数据包含不同技能专长的用户（开发、写作、设计等）
