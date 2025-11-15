# 种子数据使用指南

种子数据系统用于在数据库中初始化基础的UI组件数据，将现有的硬编码组件迁移到数据库中进行持久化存储。

## 快速开始

### 方法 1: 手动运行种子数据

```bash
# 在 apps/backend 目录下运行
pnpm run seed:run
```

### 方法 2: 启动应用时自动运行

```bash
# 设置环境变量并启动开发服务器
pnpm run seed:dev

# 或者在 .env 文件中设置 RUN_SEEDS=true
echo "RUN_SEEDS=true" >> .env
pnpm run dev
```

## 环境变量配置

在 `.env` 文件中添加以下配置：

```env
# 设置为 true 在应用启动时自动运行种子数据
RUN_SEEDS=true
```

## 种子数据内容

当前种子数据包含以下UI组件：

### 1. ExampleCard (示例卡片)
- **分类**: UI组件
- **功能**: 基础卡片布局和内容展示
- **属性**: title, description, className, children
- **标签**: 卡片, UI, 布局

### 2. InteractiveDemo (交互演示)
- **分类**: 交互组件
- **功能**: 动画效果和悬停交互
- **属性**: title, gridSize, backgroundColor, animationSpeed
- **标签**: 交互, 动画, 演示

### 3. ThreeScene (3D场景)
- **分类**: 3D组件
- **功能**: Three.js 3D场景渲染
- **属性**: width, height, backgroundColor, cameraPosition, enableControls, autoRotate
- **标签**: 3D, Three.js, 场景

## 数据结构

每个组件包含以下信息：

- 基本信息：名称、描述、分类、版本、作者
- 模板代码：组件使用模板
- 属性定义：props 和 JSON schema
- 文档和示例：详细使用说明
- 标签：用于分类和搜索

## 安全性

- 种子数据会检查现有数据，避免重复创建
- 使用数据库事务确保数据一致性
- 在生产环境中默认不运行种子数据

## 自定义种子数据

如果需要添加更多组件，可以编辑 `src/database/seeds/ui-component.seed.ts` 文件：

```typescript
const componentData = [
  {
    name: 'YourComponent',
    description: '你的组件描述',
    category: ComponentCategory.UI_COMPONENT,
    template: ':::react{component="YourComponent"}\n组件内容\n:::',
    // ... 其他属性
  }
];
```

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查数据库是否运行
   - 验证 .env 文件中的数据库配置

2. **权限错误**
   - 确保数据库用户有创建表和插入数据的权限

3. **重复运行**
   - 种子数据系统会自动检测现有数据，重复运行是安全的

### 重置数据

如果需要重新运行种子数据：

```bash
# 清空组件表（谨慎操作！）
psql -d learning_practice -c "TRUNCATE ui_components CASCADE;"

# 重新运行种子数据
pnpm run seed:run
```

## 开发指南

### 添加新的种子数据类型

1. 在 `src/database/seeds/` 目录创建新的种子服务
2. 在 `seed.module.ts` 中注册服务
3. 在 `seed-runner.service.ts` 中调用新服务

### 测试种子数据

建议在开发环境中测试种子数据：

```bash
# 使用测试数据库
DATABASE_NAME=learning_practice_test pnpm run seed:run
```

## 日志和监控

种子数据运行过程中会输出详细日志：

- ✅ 成功创建的组件
- ⏭️ 跳过的已存在组件
- ❌ 失败的操作和错误信息

查看日志以确认种子数据是否正确运行。