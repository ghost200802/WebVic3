# AI代码规范

重要：
1.前端不允许出现公式或者计算逻辑，所有计算逻辑写在Core中
2.所有的功能修改都要进行测试覆盖，包括逻辑测试和e2e测试

## 1. 项目结构

```
WebVic3/
├── apps/
│   ├── web/                    # Vue3前端应用
│   │   ├── src/
│   │   │   ├── components/     # UI组件
│   │   │   ├── views/          # 页面视图
│   │   │   ├── stores/         # Pinia状态
│   │   │   ├── composables/    # Vue组合式函数
│   │   │   └── adapters/       # 核心逻辑适配器
│   │   └── ...
│   └── server/                 # Node.js后端应用
│       ├── src/
│       │   ├── routes/         # API路由
│       │   ├── services/       # 业务逻辑
│       │   └── models/         # 数据模型
│       └── ...
├── packages/
│   ├── core/                   # 游戏核心逻辑（共享）
│   │   ├── src/
│   │   │   ├── systems/        # 游戏系统
│   │   │   ├── models/         # 数据模型
│   │   │   ├── algorithms/     # 核心算法
│   │   │   ├── interfaces/     # 接口定义
│   │   │   └── index.ts        # 导出
│   │   └── package.json
│   ├── types/                  # 共享类型定义
│   └── ui-vue/                 # Vue共享组件（可选）
├── docs/                       # 文档
└── models/                     # 数据库模型（Mongoose Schemas）
```

---

## 2. 技术栈版本

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.x | UI框架 |
| TypeScript | 5.x | 类型安全 |
| Vite | 5.x | 构建工具 |
| Pinia | - | 状态管理 |
| Tailwind CSS | - | 样式系统 |
| Headless UI | - | 无样式组件 |
| VueUse | - | 组合式API工具集 |
| ECharts | - | 图表可视化 |
| Leaflet / MapLibre GL | - | 2D地图渲染 |

### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 20.x LTS | 运行时环境 |
| Fastify | 4.x | Web框架 |
| TypeScript | 5.x | 类型安全 |
| MongoDB | - | 主数据库 |
| Mongoose | - | ODM |
| Socket.io | - | WebSocket实时通信（可选） |

---

## 3. 核心逻辑层设计原则

| 原则 | 说明 |
|------|------|
| 框架无关 | 核心逻辑不依赖Vue/React等UI框架 |
| 平台无关 | 可在浏览器、Node.js、Cocos Creator中运行 |
| 纯函数优先 | 游戏计算逻辑使用纯函数，便于测试和复用 |
| 接口抽象 | 通过接口层与UI框架解耦 |
| 无DOM依赖 | 核心逻辑不使用浏览器特有API |

---

## 4. 核心系统模块

| 模块 | 职责 | 技术方案 |
|------|------|----------|
| 经济系统 | 价格计算、供需均衡 | 瓦尔拉斯均衡算法 |
| 生产系统 | 工厂运营、生产链 | 线性规划优化 |
| 人口系统 | 人口增长、就业、需求 | 基于效用的决策模型 |
| 科技系统 | 科技树、研发进度 | 概率扩散模型 |
| 时间系统 | 游戏时间推进 | 基于Tick的离散事件模拟 |
| 存档系统 | 状态序列化 | BSON（MongoDB存储） |

## 5. 核心接口

```typescript
interface IGameEventEmitter {
  emit(event: GameEvent): void;
  on(eventType: string, handler: EventHandler): void;
  off(eventType: string, handler: EventHandler): void;
}

interface IGameStateProvider {
  getState(): GameState;
  subscribe(listener: StateListener): () => void;
}

interface ISaveManager {
  save(state: GameState): Promise<void>;
  load(saveId: string): Promise<GameState>;
  listSaves(): Promise<SaveInfo[]>;
}
```

## 6. 开发命令

```bash
pnpm install          # 安装依赖
pnpm dev              # 启动开发环境
pnpm dev:web          # 仅前端
pnpm dev:server       # 仅后端
```

## 7. 代码规范

- ESLint + TypeScript
