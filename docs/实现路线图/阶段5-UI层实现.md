# 阶段5：UI层实现

## 目标

实现完整的用户界面，提供良好的游戏体验。

**重要提示：**
- 每个子系统都有独立的详细文档
- 完成后必须进行单元测试
- 测试覆盖率 > 80% 才能进入下一阶段

---

## 子系统概览

阶段5被拆分为以下9个独立的子系统，请按顺序依次完成：

### 5.1 页面布局

**文档：** 阶段5.1-页面布局.md

**核心功能：**
- 主布局组件
- 侧边栏导航
- 顶部状态栏
- 响应式布局
- 主题切换

**实现文件：**
- MainLayout.vue
- Sidebar.vue
- TopBar.vue

---

### 5.2 主仪表盘

**文档：** 阶段5.2-主仪表盘.md

**核心功能：**
- 游戏概览显示
- 关键指标卡片
- 警告通知系统
- 实时数据更新

**实现文件：**
- Dashboard.vue
- StatCard.vue
- AlertList.vue

---

### 5.3 地图界面

**文档：** 阶段5.3-地图界面.md

**核心功能：**
- 地图视图渲染
- 地块显示
- 地图交互（选择、缩放、平移）
- 地块信息面板

**实现文件：**
- MapView.vue
- TileComponent.vue
- TileInfoPanel.vue

---

### 5.4 生产界面

**文档：** 阶段5.4-生产界面.md

**核心功能：**
- 建筑列表（支持堆叠）
- 建筑详情面板
- 生产方式切换
- 建设面板

**实现文件：**
- ProductionView.vue
- BuildingList.vue
- BuildingDetail.vue
- BuildPanel.vue
- ProductionMethodSelect.vue

---

### 5.5 市场界面

**文档：** 阶段5.5-市场界面.md

**核心功能：**
- 价格列表显示
- 交易面板（买入/卖出）
- 价格分析面板
- 价格趋势图表

**实现文件：**
- MarketView.vue
- PriceList.vue
- TradePanel.vue
- PriceAnalysis.vue
- PriceChart.vue

---

### 5.6 人口界面

**文档：** 阶段5.6-人口界面.md

**核心功能：**
- 人口列表
- 人口详情面板
- 就业管理面板
- 工人分配

**实现文件：**
- PopulationView.vue
- PopulationList.vue
- PopulationDetail.vue
- EmploymentPanel.vue

---

### 5.7 科技界面

**文档：** 阶段5.7-科技界面.md

**核心功能：**
- 科技树显示
- 研发队列管理
- 科技详情面板
- 科技筛选搜索

**实现文件：**
- TechnologyView.vue
- TechTree.vue
- ResearchQueue.vue
- TechDetail.vue
- TechNode.vue

---

### 5.8 设置界面

**文档：** 阶段5.8-设置界面.md

**核心功能：**
- 游戏设置（难度、速度）
- 界面设置（主题、语言）
- 存档管理

**实现文件：**
- SettingsView.vue
- GameSettings.vue
- UISettings.vue
- SaveManager.vue
- SaveSlot.vue

---

### 5.9 数据可视化

**文档：** 阶段5.9-数据可视化.md

**核心功能：**
- 折线图（价格趋势）
- 柱状图（生产对比）
- 饼图（人口组成）
- 面积图（库存变化）
- 图表导出

**实现文件：**
- LineChart.vue
- BarChart.vue
- PieChart.vue
- AreaChart.vue
- ChartContainer.vue

---

## 总体任务清单

- [ ] 完成 5.1 页面布局
- [ ] 完成 5.2 主仪表盘
- [ ] 完成 5.3 地图界面
- [ ] 完成 5.4 生产界面
- [ ] 完成 5.5 市场界面
- [ ] 完成 5.6 人口界面
- [ ] 完成 5.7 科技界面
- [ ] 完成 5.8 设置界面
- [ ] 完成 5.9 数据可视化
- [ ] 创建组件导出文件
- [ ] 创建适配器层（连接核心状态到Vue）

---

## 创建导出文件

### 创建组件导出文件

在 apps/web/src/components/ 创建 index.ts

**导出内容：**
- layout/ 目录中的所有组件
- dashboard/ 目录中的所有组件
- map/ 目录中的所有组件
- production/ 目录中的所有组件
- market/ 目录中的所有组件
- population/ 目录中的所有组件
- technology/ 目录中的所有组件
- settings/ 目录中的所有组件
- charts/ 目录中的所有组件

### 创建适配器导出文件

在 apps/web/src/adapters/ 创建 index.ts

**导出内容：**
- coreAdapter.ts - 核心状态到Vue的适配器

---

## 测试运行

运行单元测试命令：cd apps/web && pnpm test

运行覆盖率测试：cd apps/web && pnpm test:coverage

---

## 完成标准

### 功能实现完成

- [ ] 页面布局实现完整
- [ ] 主仪表盘实现完整
- [ ] 地图界面实现完整
- [ ] 生产界面实现完整
- [ ] 市场界面实现完整
- [ ] 人口界面实现完整
- [ ] 科技界面实现完整
- [ ] 设置界面实现完整
- [ ] 数据可视化实现完整
- [ ] 适配器层实现完整

### 测试完成

- [ ] 所有单元测试通过
- [ ] 测试覆盖率 > 80%
- [ ] 所有公共组件有测试

### 代码检查完成

- [ ] pnpm typecheck 通过
- [ ] pnpm lint 通过
- [ ] 无TypeScript错误
- [ ] 无ESLint错误

---

## 进入下一阶段条件

✅ 所有子系统文档任务完成
✅ 所有界面实现完整
✅ 所有单元测试通过
✅ 测试覆盖率 > 80%
✅ TypeScript类型检查通过
✅ ESLint代码检查通过

---

## 下一步

完成所有子系统后，进入阶段6-后端实现

**重要提醒：** 确保所有子系统测试通过且覆盖率达标后再进入下一阶段！
