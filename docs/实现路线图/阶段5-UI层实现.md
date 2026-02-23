# 阶段5：UI层实现

## 目标

实现完整的用户界面，提供良好的游戏体验。

**重要提示：**
- 本文档只包含接口定义和功能要求，不包含详细代码实现
- 完成后必须进行单元测试
- 测试覆盖率 > 80% 才能进入下一阶段

---

## 任务清单

- [ ] 实现页面布局
- [ ] 实现主仪表盘
- [ ] 实现地图界面
- [ ] 实现生产界面
- [ ] 实现市场界面
- [ ] 实现人口界面
- [ ] 实现科技界面
- [ ] 实现设置界面
- [ ] 实现数据可视化
- [ ] 编写单元测试

---

## 1. 页面布局

### 1.1 接口定义要求

**LayoutProps接口：**
```typescript
interface LayoutProps {
  currentRoute: string
}
```

**SidebarItem接口：**
```typescript
interface SidebarItem {
  id: string
  label: string
  icon: string
  route: string
  badge?: number
}
```

### 1.2 功能要求

**布局组件功能：**
- 响应式布局
- 侧边栏导航
- 顶部状态栏
- 主内容区域
- 主题切换

**侧边栏功能：**
- 导航菜单
- 快捷操作
- 通知提示
- 搜索功能

**顶部状态栏功能：**
- 显示当前日期
- 显示游戏时间
- 显示时代
- 显示人口
- 显示资金
- 暂停/继续按钮

### 1.3 测试要求

**布局测试：**
- [ ] 测试响应式布局
- [ ] 测试导航切换
- [ ] 测试主题切换
- [ ] 测试状态栏显示

### 1.4 测试覆盖率要求

- 代码覆盖率 > 80%
- 所有公共组件必须有测试

---

## 2. 主仪表盘

### 2.1 接口定义要求

**DashboardData接口：**
```typescript
interface DashboardData {
  gameDate: GameDate
  era: Era
  population: number
  treasury: number
  income: number
  expenses: number
  production: Map<string, number>
  alerts: GameAlert[]
}
```

**GameAlert接口：**
```typescript
interface GameAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: number
}
```

### 2.2 功能要求

**仪表盘功能：**
- 显示游戏概览信息
- 显示关键指标（人口、资金、收入/支出）
- 显示生产概况
- 显示市场概况
- 显示活跃事件
- 显示警告和通知

**统计卡片：**
- 人口卡片
- 资金卡片
- 时代卡片
- 时间卡片
- 生产卡片
- 科技卡片

### 2.3 测试要求

**仪表盘测试：**
- [ ] 测试数据绑定
- [ ] 测试统计卡片更新
- [ ] 测试警告显示
- [ ] 测试时间更新

### 2.4 测试覆盖率要求

- 代码覆盖率 > 80%
- 所有公共组件必须有测试

---

## 3. 地图界面

### 3.1 接口定义要求

**MapViewProps接口：**
```typescript
interface MapViewProps {
  tiles: Map<string, Tile>
  buildings: Map<string, Building>
  selectedTileId: string | null
  onTileSelect: (tileId: string) => void
}
```

**TileInteraction接口：**
```typescript
interface TileInteraction {
  type: 'select' | 'explore' | 'develop' | 'build'
  tileId: string
}
```

### 3.2 功能要求

**地图显示功能：**
- 显示所有地块
- 显示地块地形
- 显示建筑
- 显示控制区域
- 显示可探索区域
- 缩放功能
- 平移功能

**地图交互功能：**
- 点击选择地块
- 右键上下文菜单
- 拖拽平移
- 滚轮缩放

**地块信息面板：**
- 显示地块基本信息
- 显示地形组成
- 显示建筑列表
- 显示资源矿床
- 显示开发度

### 3.3 测试要求

**地图测试：**
- [ ] 测试地图渲染
- [ ] 测试地块选择
- [ ] 测试缩放和平移
- [ ] 测试信息面板显示
- [ ] 测试性能（大量地块）

### 3.4 测试覆盖率要求

- 代码覆盖率 > 80%
- 所有公共组件必须有测试

---

## 4. 生产界面

### 4.1 接口定义要求

**ProductionViewProps接口：**
```typescript
interface ProductionViewProps {
  buildings: Building[]
  population: Population[]
  marketPrices: Map<string, number>
  onBuild: (configKey: string, tileId: string) => void
  onUpgrade: (buildingId: string) => void
  onChangeMethod: (buildingId: string, methodId: string) => void
}
```

### 4.2 功能要求

**建筑列表功能：**
- 显示所有建筑
- 按类型筛选
- 按地块筛选
- 显示建筑状态
- 显示生产效率
- 显示工人数量

**建筑详情面板：**
- 显示建筑信息
- 显示生产方式
- 切换生产方式
- 显示产出
- 显示消耗
- 显示效率计算

**建设面板：**
- 显示可用建筑
- 显示建筑成本
- 显示前置条件
- 显示可建设位置
- 预览建筑效果

### 4.3 测试要求

**生产界面测试：**
- [ ] 测试建筑列表渲染
- [ ] 测试建筑筛选
- [ ] 测试建筑详情显示
- [ ] 测试建设面板
- [ ] 测试生产方式切换

### 4.4 测试覆盖率要求

- 代码覆盖率 > 80%
- 所有公共组件必须有测试

---

## 5. 市场界面

### 5.1 接口定义要求

**MarketViewProps接口：**
```typescript
interface MarketViewProps {
  market: Market
  prices: Map<string, number>
  inventory: Map<string, number>
  onBuy: (goodsId: string, amount: number) => void
  onSell: (goodsId: string, amount: number) => void
}
```

### 5.2 功能要求

**价格列表功能：**
- 显示所有商品价格
- 显示价格趋势图
- 显示价格变化
- 按类型筛选

**交易面板：**
- 显示库存
- 执行买入操作
- 执行卖出操作
- 显示交易成本
- 显示交易历史

**价格分析面板：**
- 显示供需关系
- 显示库存水平
- 显示价格预测
- 显示历史价格图表

### 5.3 测试要求

**市场界面测试：**
- [ ] 测试价格列表渲染
- [ ] 测试交易操作
- [ ] 测试价格图表
- [ ] 测试库存显示

### 5.4 测试覆盖率要求

- 代码覆盖率 > 80%
- 所有公共组件必须有测试

---

## 6. 人口界面

### 6.1 接口定义要求

**PopulationViewProps接口：**
```typescript
interface PopulationViewProps {
  population: Map<string, Population>
  employment: Map<string, number>
  livingStandards: Map<string, number>
  onAssignWorker: (populationId: string, buildingId: string) => void
  onRemoveWorker: (populationId: string) => void
}
```

### 6.2 功能要求

**人口列表功能：**
- 显示所有人口群体
- 显示人口数量
- 显示就业状态
- 显示工资水平
- 显示生活水平

**人口详情面板：**
- 显示人口组成
- 显示年龄分布
- 显示需求满足度
- 显示收入/支出

**就业管理面板：**
- 显示可分配工人
- 显示空闲职位
- 分配工人到建筑
- 解雇工人
- 显示工资成本

### 6.3 测试要求

**人口界面测试：**
- [ ] 测试人口列表渲染
- [ ] 测试就业分配
- [ ] 测试详情面板显示
- [ ] 测试生活水平计算

### 6.4 测试覆盖率要求

- 代码覆盖率 > 80%
- 所有公共组件必须有测试

---

## 7. 科技界面

### 7.1 接口定义要求

**TechnologyViewProps接口：**
```typescript
interface TechnologyViewProps {
  availableTechs: Technology[]
  researchedTechs: Set<string>
  researchQueue: ResearchQueue
  onAddToQueue: (techId: string) => void
  onRemoveFromQueue: (techId: string) => void
}
```

### 7.2 功能要求

**科技树显示：**
- 显示所有科技
- 显示科技关系（前置科技）
- 显示解锁效果
- 筛选时代
- 搜索科技

**研发队列面板：**
- 显示队列中的科技
- 显示研发进度
- 显示预计完成时间
- 调整队列顺序
- 移除科技

**科技详情面板：**
- 显示科技信息
- 显示前置科技
- 显示解锁内容
- 显示研发成本
- 显示研发时间

### 7.3 测试要求

**科技界面测试：**
- [ ] 测试科技树渲染
- [ ] 测试研发队列
- [ ] 测试科技详情显示
- [ ] 测试队列操作

### 7.4 测试覆盖率要求

- 代码覆盖率 > 80%
- 所有公共组件必须有测试

---

## 8. 设置界面

### 8.1 接口定义要求

**SettingsProps接口：**
```typescript
interface SettingsProps {
  settings: GameSettings
  onSave: (settings: GameSettings) => void
  onLoad: () => void
}
```

**GameSettings接口：**
```typescript
interface GameSettings {
  autoSaveInterval: number
  autoSaveCount: number
  difficulty: 'easy' | 'normal' | 'hard'
  gameSpeed: number
  notifications: boolean
  soundEnabled: boolean
}
```

### 8.2 功能要求

**游戏设置：**
- 游戏难度
- 游戏速度
- 自动保存间隔
- 自动保存数量

**界面设置：**
- 主题选择
- 语言选择
- 通知设置
- 音效设置

**存档管理：**
- 显示存档列表
- 加载存档
- 删除存档
- 导出存档
- 导入存档

### 8.3 测试要求

**设置界面测试：**
- [ ] 测试设置保存
- [ ] 测试设置加载
- [ ] 测试存档管理
- [ ] 测试主题切换

### 8.4 测试覆盖率要求

- 代码覆盖率 > 80%
- 所有公共组件必须有测试

---

## 9. 数据可视化

### 9.1 接口定义要求

**ChartData接口：**
```typescript
interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    color: string
  }[]
}
```

**ChartConfig接口：**
```typescript
interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area'
  title: string
  xAxis?: string
  yAxis?: string
  legend?: boolean
}
```

### 9.2 功能要求

**图表类型：**
- 折线图（价格趋势）
- 柱状图（生产对比）
- 饼图（人口组成）
- 面积图（库存变化）

**交互功能：**
- 悬停显示详情
- 缩放和平移
- 导出图表
- 自定义时间范围

### 9.3 测试要求

**图表测试：**
- [ ] 测试图表渲染
- [ ] 测试数据更新
- [ ] 测试交互功能
- [ ] 测试导出功能

### 9.4 测试覆盖率要求

- 代码覆盖率 > 80%
- 所有公共组件必须有测试

---

## 10. 状态管理

### 10.1 接口定义要求

**Store接口：**
```typescript
interface Store {
  state: GameState
  actions: {
    tick: () => void
    pause: () => void
    resume: () => void
    loadGame: (data: string) => void
    saveGame: () => string
  }
  getters: {
    isPaused: boolean
    gameDate: GameDate
    era: Era
  }
}
```

### 10.2 功能要求

**状态管理：**
- 使用Pinia管理状态
- 响应式更新
- 持久化存储
- 模块化组织

**Action功能：**
- 时间推进
- 暂停/继续
- 加载存档
- 保存存档

**Getter功能：**
- 计算属性
- 数据过滤
- 数据转换

### 10.3 测试要求

**状态管理测试：**
- [ ] 测试状态更新
- [ ] 测试Action执行
- [ ] 测试Getter计算
- [ ] 测试响应式更新

### 10.4 测试覆盖率要求

- 代码覆盖率 > 80%
- 所有公共Store必须有测试

---

## 11. 创建导出文件

### 11.1 创建组件导出文件

在 `apps/web/src/components/` 创建 `index.ts`

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

### 11.2 创建Store导出文件

在 `apps/web/src/stores/` 创建 `index.ts`

**导出内容：**
- gameStore.ts
- settingsStore.ts

---

## 12. 编写单元测试

### 12.1 创建测试文件

创建以下测试文件：
- `apps/web/src/components/layout/__tests__/MainLayout.test.ts`
- `apps/web/src/components/dashboard/__tests__/Dashboard.test.ts`
- `apps/web/src/components/map/__tests__/MapView.test.ts`
- `apps/web/src/components/production/__tests__/ProductionView.test.ts`
- `apps/web/src/components/market/__tests__/MarketView.test.ts`
- `apps/web/src/components/population/__tests__/PopulationView.test.ts`
- `apps/web/src/components/technology/__tests__/TechnologyView.test.ts`
- `apps/web/src/components/settings/__tests__/SettingsView.test.ts`
- `apps/web/src/stores/__tests__/gameStore.test.ts`

### 12.2 测试运行

```bash
cd apps/web
pnpm test
```

### 12.3 测试覆盖率

```bash
cd apps/web
pnpm test:coverage
```

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

### 文件创建完成

- [ ] MainLayout.vue 创建完成
- [ ] Sidebar.vue 创建完成
- [ ] TopBar.vue 创建完成
- [ ] Dashboard.vue 创建完成
- [ ] MapView.vue 创建完成
- [ ] ProductionView.vue 创建完成
- [ ] MarketView.vue 创建完成
- [ ] PopulationView.vue 创建完成
- [ ] TechnologyView.vue 创建完成
- [ ] SettingsView.vue 创建完成
- [ ] 所有图表组件创建完成
- [ ] 所有Store创建完成
- [ ] 所有导出文件创建完成

### 测试完成

- [ ] 所有单元测试通过
- [ ] 测试覆盖率 > 80%
- [ ] 所有公共组件有测试

### 代码检查完成

- [ ] `pnpm typecheck` 通过
- [ ] `pnpm lint` 通过
- [ ] 无TypeScript错误
- [ ] 无ESLint错误

---

## 进入下一阶段条件

✅ 所有任务清单完成
✅ 所有界面实现完整
✅ 所有单元测试通过
✅ 测试覆盖率 > 80%
✅ TypeScript类型检查通过
✅ ESLint代码检查通过

---

## 下一步

完成阶段5后，进入[阶段6-后端实现](./阶段6-后端实现.md)

**重要提醒：** 确保所有测试通过且覆盖率达标后再进入下一阶段！
