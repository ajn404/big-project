-- 为assets表添加isMosaicDefault字段
ALTER TABLE assets ADD COLUMN isMosaicDefault BOOLEAN DEFAULT FALSE;

-- 为现有记录设置默认值
UPDATE assets SET isMosaicDefault = FALSE WHERE isMosaicDefault IS NULL;

-- 确保字段不为空
ALTER TABLE assets ALTER COLUMN isMosaicDefault SET NOT NULL;