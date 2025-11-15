# UI组件种子数据快速开始 🚀

这个指南将帮你快速设置和运行UI组件的种子数据，将硬编码的组件数据迁移到数据库中。

## 🎯 一键运行

```bash
# 进入后端目录
cd apps/backend

# 运行种子数据
npm run seed:run
```

## 📋 详细步骤

### 1. 确保数据库运行

```bash
# 确保PostgreSQL服务运行
# 数据库名称: learning_practice
```

### 2. 配置环境变量

复制并编辑环境变量文件：
```bash
cp .env.example .env
```

在 `.env` 文件中配置数据库连接：
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=learning_practice
```

### 3. 运行种子数据

#### 选项 A: 手动运行（推荐）
```bash
npm run seed:run
```

#### 选项 B: 启动时自动运行
```bash
# 在 .env 中添加
RUN_SEEDS=true

# 然后启动应用
npm run dev
```

#### 选项 C: 开发模式自动运行
```bash
npm run seed:dev
```

### 4. 验证结果

```bash
# 验证种子数据
npm run seed:validate

# 或者启动应用查看GraphQL Playground
npm run dev
# 访问 http://localhost:3001/graphql
```

## 🎉 预期结果

成功运行后，你将看到：

```
✅ 开始初始化UI组件种子数据...
✅ 创建标签...
✅ 创建UI组件...
✅ 创建组件: ExampleCard
✅ 创建组件: InteractiveDemo  
✅ 创建组件: ThreeScene
✅ 成功初始化 3 个UI组件
```

## 🧪 测试组件管理

1. **启动前后端服务**
   ```bash
   # 后端 (端口 3001)
   cd apps/backend && npm run dev
   
   # 前端 (端口 3000)
   cd apps/frontend && npm run dev
   ```

2. **访问组件管理页面**
   - 打开 http://localhost:3000
   - 导航到"组件管理"页面
   - 查看从数据库加载的组件

3. **测试功能**
   - ✅ 查看组件列表
   - ✅ 搜索和过滤组件
   - ✅ 预览组件效果
   - ✅ 编辑组件信息
   - ✅ 创建新组件
   - ✅ 删除组件

## 🔍 GraphQL查询示例

在GraphQL Playground中测试：

```graphql
# 获取所有组件
query {
  uiComponents {
    id
    name
    description
    category
    template
    tags {
      name
      color
    }
  }
}

# 按分类查询
query {
  uiComponentsByCategory(category: UI组件) {
    name
    description
  }
}

# 创建新组件
mutation {
  createUIComponent(createUIComponentInput: {
    name: "MyNewComponent"
    description: "我的新组件"
    category: UI组件
    template: ":::react{component=\"MyNewComponent\"}\n内容\n:::"
    tagNames: ["自定义", "测试"]
  }) {
    id
    name
  }
}
```

## 🛠 故障排除

### 问题 1: 数据库连接失败
```bash
# 检查数据库状态
psql -h localhost -U postgres -d learning_practice -c "SELECT version();"

# 如果数据库不存在，创建它
psql -h localhost -U postgres -c "CREATE DATABASE learning_practice;"
```

### 问题 2: 权限错误
```bash
# 确保用户有足够权限
psql -h localhost -U postgres -c "GRANT ALL ON DATABASE learning_practice TO postgres;"
```

### 问题 3: 端口冲突
```env
# 在 .env 中更改端口
PORT=3002
```

### 问题 4: 重复运行种子数据
种子数据系统是幂等的，重复运行是安全的。如果需要重置：

```bash
# ⚠️ 警告：这会删除所有组件数据
psql -d learning_practice -c "TRUNCATE ui_components CASCADE;"
npm run seed:run
```

## 📊 验证成功

运行验证脚本：
```bash
npm run seed:validate
```

期望输出：
```
✅ 找到 3 个UI组件
✅ 组件 ExampleCard 验证通过
✅ 组件 InteractiveDemo 验证通过
✅ 组件 ThreeScene 验证通过
组件统计信息:
- 总计: 3
- 活跃: 3
- 非活跃: 0
- 已废弃: 0
```

## 🎊 下一步

种子数据成功运行后：

1. **体验组件管理** - 在前端界面中管理组件
2. **添加自定义组件** - 通过UI或GraphQL添加新组件
3. **导入现有组件** - 将其他硬编码组件迁移到数据库
4. **配置生产环境** - 在生产环境中部署组件管理系统

恭喜！🎉 你已经成功将组件管理系统从硬编码迁移到数据库持久化存储！