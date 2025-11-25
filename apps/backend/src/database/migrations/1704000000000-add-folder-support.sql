-- 创建文件夹表
CREATE TABLE IF NOT EXISTS "folders" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" varchar NOT NULL,
  "description" varchar,
  "parentId" uuid,
  "color" varchar DEFAULT '#3b82f6',
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "FK_folders_parentId" FOREIGN KEY ("parentId") REFERENCES "folders"("id") ON DELETE CASCADE
);

-- 为资源表添加文件夹ID字段
ALTER TABLE "assets" ADD COLUMN IF NOT EXISTS "folderId" uuid;

-- 添加外键约束
ALTER TABLE "assets" ADD CONSTRAINT "FK_assets_folderId" 
FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL;

-- 创建索引
CREATE INDEX IF NOT EXISTS "IDX_folders_parentId" ON "folders" ("parentId");
CREATE INDEX IF NOT EXISTS "IDX_assets_folderId" ON "assets" ("folderId");
CREATE INDEX IF NOT EXISTS "IDX_folders_name_parentId" ON "folders" ("name", "parentId");