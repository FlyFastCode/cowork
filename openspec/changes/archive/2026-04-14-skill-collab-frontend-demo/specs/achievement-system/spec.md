## ADDED Requirements

### Requirement: 总成就值展示
系统 SHALL 在显著位置展示用户的总成就值（信用分）。

#### Scenario: 展示总积分
- **WHEN** 用户访问个人主页或仪表板
- **THEN** 系统在顶部展示总成就值

### Requirement: 领域成就值雷达图
系统 SHALL 以雷达图形式展示用户在各个技能领域的成就值。

#### Scenario: 渲染雷达图
- **WHEN** 成就数据加载完成
- **THEN** 系统渲染多边形雷达图，每个顶点代表一个技能领域

#### Scenario: 领域详情提示
- **WHEN** 用户悬停在雷达图的某个顶点
- **THEN** 系统显示该领域的详细成就值和排名

### Requirement: 成就值时间趋势
系统 SHALL 展示成就值随时间的变化趋势。

#### Scenario: 展示趋势图
- **WHEN** 用户查看成就详情
- **THEN** 系统以折线图展示成就值的历史变化

### Requirement: 技能标签云
系统 SHALL 以标签云形式展示用户擅长的技能领域。

#### Scenario: 生成标签云
- **WHEN** 成就数据加载完成
- **THEN** 系统根据成就值大小显示不同大小的技能标签

#### Scenario: 标签交互
- **WHEN** 用户点击某个技能标签
- **THEN** 系统跳转到该技能相关的任务或详情

### Requirement: 成就排名展示
系统 SHALL 展示用户在平台或各领域的排名。

#### Scenario: 展示总排名
- **WHEN** 用户查看个人信息
- **THEN** 系统展示用户在平台中的总排名

#### Scenario: 展示领域排名
- **WHEN** 用户查看某个技能领域详情
- **THEN** 系统展示该领域的排名和百分比

### Requirement: 成就获取记录
系统 SHALL 展示成就值的获取历史记录。

#### Scenario: 展示获取历史
- **WHEN** 用户查看成就记录
- **THEN** 系统按时间顺序展示每次成就值变动的来源
