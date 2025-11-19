import React, { useState, useCallback } from 'react';
import { Input, Button, Textarea,Card, CardContent } from '@workspace/ui-components';
import { Upload, X, FileIcon, ImageIcon } from 'lucide-react';
// 不再需要UPLOAD_ASSET，改用REST API
import { AssetType, CreateAssetInput } from '@/types/asset';

interface AssetUploadProps {
  onSuccess?: (asset: any) => void;
  allowedTypes?: AssetType[];
  maxFiles?: number;
}

export function AssetUpload({ onSuccess, allowedTypes, maxFiles = 10 }: AssetUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [alt, setAlt] = useState('');

  // 使用REST API而不是GraphQL进行文件上传
  const uploadAssetREST = async (file: File, input: CreateAssetInput) => {
    const formData = new FormData();
    formData.append('file', file);
    if (input.description) formData.append('description', input.description);
    if (input.alt) formData.append('alt', input.alt);

    const response = await fetch('/api/assets/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      if (allowedTypes) {
        const fileType = getFileType(file.type);
        return allowedTypes.includes(fileType);
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles].slice(0, maxFiles));
  }, [allowedTypes, maxFiles]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      if (allowedTypes) {
        const fileType = getFileType(file.type);
        return allowedTypes.includes(fileType);
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles].slice(0, maxFiles));
  }, [allowedTypes, maxFiles]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const input: CreateAssetInput = {
          description: description || undefined,
          alt: (file.type.startsWith('image/') && alt) ? alt : undefined,
        };

        const result = await uploadAssetREST(file, input);
        return result;
      });

      const results = await Promise.all(uploadPromises);

      results.forEach((asset: any) => {
        if (asset && onSuccess) {
          onSuccess(asset);
        }
      });

      // 重置表单
      setFiles([]);
      setDescription('');
      setAlt('');

    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }, [files, description, alt, onSuccess]);

  const getFileType = (mimeType: string): AssetType => {
    if (mimeType.startsWith('image/')) return AssetType.IMAGE;
    if (mimeType.startsWith('video/')) return AssetType.VIDEO;
    if (mimeType.startsWith('audio/')) return AssetType.AUDIO;
    if (mimeType.includes('pdf') || mimeType.includes('document')) return AssetType.DOCUMENT;
    return AssetType.OTHER;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hasImages = files.some(file => file.type.startsWith('image/'));

  return (
    <div className="space-y-4">
      {/* 拖拽上传区域 */}
      <Card>
        <CardContent className="p-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">拖拽文件到这里或点击选择</p>
              <p className="text-sm text-gray-500">
                {allowedTypes
                  ? `支持 ${allowedTypes.join(', ')} 类型文件`
                  : '支持所有类型文件'
                }
              </p>
              <input
                type="file"
                multiple={maxFiles > 1}
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept={allowedTypes?.includes(AssetType.IMAGE) ? 'image/*' : undefined}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>选择文件</span>
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 已选择的文件列表 */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">已选择的文件 ({files.length})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="w-4 h-4 text-blue-500" />
                    ) : (
                      <FileIcon className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-sm font-medium truncate">{file.name}</span>
                    <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 元数据输入 */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium">文件信息</h3>
            <div>
              <label className="text-sm font-medium mb-2 block">描述</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="为这些文件添加描述..."
                rows={2}
              />
            </div>
            {hasImages && (
              <div>
                <label className="text-sm font-medium mb-2 block">Alt 文本 (图片)</label>
                <Input
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="图片的替代文本..."
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 上传按钮 */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className="min-w-[120px]"
        >
          {uploading ? '上传中...' : `上传 ${files.length} 个文件`}
        </Button>
      </div>
    </div>
  );
}