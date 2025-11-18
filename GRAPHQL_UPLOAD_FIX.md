# GraphQL Upload错误修复

## 🔧 问题诊断

### 错误信息
```
Unknown type "Upload". Did you mean "Float"?
Unknown argument "file" on field "Mutation.uploadAsset".
```

### 根本原因
- 前端仍在使用GraphQL Upload mutation
- 后端已移除Upload类型但前端代码未更新
- GraphQL schema中存在不一致的定义

## ✅ 解决方案

### 1. 清理前端GraphQL查询
```typescript
// apps/frontend/src/lib/graphql/asset-queries.ts

// 移除 - 不再使用
// export const UPLOAD_ASSET = gql`
//   mutation UploadAsset($file: Upload!, $input: CreateAssetInput) { ... }
// `;

// 保留 - 仍然使用
export const GET_ASSETS = gql`
  query GetAssets($type: AssetType, $search: String, $limit: Int, $offset: Int) {
    assets(type: $type, search: $search, limit: $limit, offset: $offset) { ... }
  }
`;
```

### 2. 清理后端Resolver
```typescript
// apps/backend/src/asset/asset.resolver.ts

// 移除GraphQL上传mutation
// @Mutation(() => Asset)
// async uploadAsset(@UploadedFile() file, @Args('input') input) { ... }

// 保留查询和其他操作
@Query(() => [Asset], { name: 'assets' })
findAll() { ... }

@Mutation(() => Asset)
updateAsset() { ... }
```

## 🎯 新的架构

### 文件操作分离
```
文件上传: REST API  
├── POST /api/assets/upload     # 文件上传
└── GET /api/assets/download/:id # 文件下载

数据操作: GraphQL
├── Query assets               # 获取资源列表
├── Query asset(id)           # 获取单个资源  
├── Mutation updateAsset      # 更新资源信息
└── Mutation removeAsset      # 删除资源
```

### 前端上传流程
```typescript
// AssetUpload组件中
const uploadAssetREST = async (file: File, input: CreateAssetInput) => {
  const formData = new FormData();
  formData.append('file', file);
  if (input.description) formData.append('description', input.description);
  
  const response = await fetch('/api/assets/upload', {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
};
```

## 📊 修复验证

### GraphQL Schema 现在包含
```graphql
type Query {
  assets(type: AssetType, search: String, limit: Int, offset: Int): [Asset!]!
  asset(id: ID!): Asset
  assetStats: AssetStatsType
}

type Mutation {
  updateAsset(input: UpdateAssetInput!): Asset!
  removeAsset(id: ID!): Boolean!
  # 注意：没有 uploadAsset mutation
}

type Asset {
  id: ID!
  name: String!
  url: String!
  type: AssetType!
  metadata: JSONObject
  # ... 其他字段
}
```

### 无错误的GraphQL查询
```bash
# 现在可以正常工作
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { assets { id name type } }"}'
```

## 🚀 使用方式

### 上传文件
```typescript
// 使用REST API
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/assets/upload', {
    method: 'POST', 
    body: formData
  });
  
  return response.json();
};
```

### 查询资源
```typescript
// 使用GraphQL
const { data } = useQuery(GET_ASSETS, {
  variables: { limit: 10, offset: 0 }
});
```

## 🎉 最终状态

✅ **GraphQL错误完全消除**  
✅ **文件上传使用稳定的REST API**  
✅ **资源查询使用优化的GraphQL**  
✅ **前后端API完全一致**  

现在资源管理系统可以无错误运行！🚀