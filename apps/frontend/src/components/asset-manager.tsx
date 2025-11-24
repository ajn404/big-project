import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Badge, Card, CardContent, CardFooter, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox } from '@workspace/ui-components';
import {
  Upload,
  Search,
  EyeIcon,
  Edit,
  Trash2,
  Image as ImageIcon,
  FileVideo,
  FileText,
  FileAudio,
  File
} from 'lucide-react';
import { GET_ASSETS, REMOVE_ASSET, UPDATE_ASSET } from '@/lib/graphql/asset-queries';
import { Asset, AssetType, UpdateAssetInput } from '@/types/asset';
import { AssetUpload } from './asset-upload';
import { ImagePreview } from './image-preview';
import { useDebounce } from 'use-debounce';

interface AssetManagerProps {
  onSelect?: (asset: Asset) => void;
  selectionMode?: boolean;
  allowedTypes?: AssetType[];
}

const getAssetIcon = (type: AssetType) => {
  switch (type) {
    case AssetType.IMAGE: return ImageIcon;
    case AssetType.VIDEO: return FileVideo;
    case AssetType.AUDIO: return FileAudio;
    case AssetType.DOCUMENT: return FileText;
    default: return File;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function AssetManager({ onSelect, selectionMode = false, allowedTypes }: AssetManagerProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AssetType | undefined>();
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);

  // 图片预览状态
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<Array<{ src: string; alt: string }>>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data, loading, refetch } = useQuery(GET_ASSETS, {
    variables: {
      search: debouncedSearch || undefined,
      type: typeFilter,
      limit: 50,
    },
  });

  const [removeAsset] = useMutation(REMOVE_ASSET, {
    onCompleted: () => refetch(),
  });

  const [updateAsset] = useMutation(UPDATE_ASSET, {
    onCompleted: () => {
      setEditingAsset(null);
      refetch();
    },
  });

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('确定要删除这个资源吗？')) {
      await removeAsset({ variables: { id } });
    }
  }, [removeAsset]);

  const handleEdit = useCallback((asset: Asset) => {
    setEditingAsset(asset);
  }, []);

  const handleSaveEdit = useCallback(async (input: UpdateAssetInput) => {
    await updateAsset({ variables: { input } });
  }, [updateAsset]);

  const filteredAssets = data?.assets?.filter((asset: Asset) =>
    !allowedTypes || allowedTypes.includes(asset.type)
  ) || [];


  const handlePreview = useCallback((asset: Asset) => {
    if (asset.type === AssetType.IMAGE) {
      // 获取所有图片资源
      const imageAssets = filteredAssets.filter((a: Asset) => a.type === AssetType.IMAGE);
      const images = imageAssets.map((a: Asset) => ({
        src: a.url,
        alt: a.alt || a.name
      }));

      // 找到当前图片的索引
      const currentIndex = imageAssets.findIndex((a: Asset) => a.id === asset.id);

      setPreviewImages(images);
      setCurrentImageIndex(Math.max(0, currentIndex));
      setPreviewOpen(true);
    } else {
      // 非图片资源仍然使用window.open
      window.open(asset.url, '_blank');
    }
  }, [filteredAssets]);


  const typeOptions = Object.values(AssetType).filter(type =>
    !allowedTypes || allowedTypes.includes(type)
  );

  // 图片预览导航函数
  const handlePreviousImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : previewImages.length - 1));
  }, [previewImages.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev < previewImages.length - 1 ? prev + 1 : 0));
  }, [previewImages.length]);

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索资源..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select
          value={typeFilter || ''}
          onValueChange={(value) => setTypeFilter(value as AssetType || undefined)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="所有类型" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              上传资源
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>上传资源</DialogTitle>
            </DialogHeader>
            <AssetUpload
              onSuccess={() => {
                setShowUpload(false);
                refetch();
              }}
              allowedTypes={allowedTypes}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* 资源网格 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-1" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : filteredAssets.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            {search || typeFilter ? '没有找到匹配的资源' : '还没有上传任何资源'}
          </div>
        ) : (
          filteredAssets.map((asset: Asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onSelect={selectionMode ? () => onSelect?.(asset) : undefined}
              onEdit={() => handleEdit(asset)}
              onDelete={() => handleDelete(asset.id)}
              onPreview={() => handlePreview(asset)}
              selectionMode={selectionMode}
            />
          ))
        )}
      </div>

      {/* 编辑对话框 */}
      {editingAsset && (
        <AssetEditDialog
          asset={editingAsset}
          open={!!editingAsset}
          onOpenChange={(open) => !open && setEditingAsset(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* 图片预览 */}
      <ImagePreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        currentIndex={currentImageIndex}
        images={previewImages}
        onPrevious={handlePreviousImage}
        onNext={handleNextImage}
      />
    </div>
  );
}

interface AssetCardProps {
  asset: Asset;
  onSelect?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
  selectionMode: boolean;
}

function AssetCard({ asset, onSelect, onEdit, onDelete, onPreview, selectionMode }: AssetCardProps) {
  const IconComponent = getAssetIcon(asset.type);

  return (
    <Card className={`group overflow-hidden transition-all hover:shadow-md ${selectionMode ? 'cursor-pointer  hover:ring-2 hover:ring-blue-500' : ''
      }`} onClick={onSelect}>
      <CardContent className="p-0">
        <div className="aspect-square relative bg-gray-50 flex items-center justify-center">
          {asset.type === AssetType.IMAGE ? (
            <img
              src={asset.url}
              alt={asset.alt || asset.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <IconComponent className="w-12 h-12 text-gray-400" />
          )}

          {!selectionMode && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onPreview(); }}>
                  <EyeIcon className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3">
        <div className="w-full">
          <p className="text-sm font-medium truncate" title={asset.name}>
            {asset.name}
          </p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-1">
              <Badge variant="secondary" className="text-xs">
                {asset.type}
              </Badge>
              {asset.type === AssetType.IMAGE && asset.isMosaicDefault && (
                <Badge variant="outline" className="text-xs">
                  马赛克
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {formatFileSize(asset.size)}
            </span>
          </div>
          {asset.description && (
            <p className="text-xs text-gray-600 mt-1 truncate" title={asset.description}>
              {asset.description}
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

interface AssetEditDialogProps {
  asset: Asset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (input: UpdateAssetInput) => void;
}

function AssetEditDialog({ asset, open, onOpenChange, onSave }: AssetEditDialogProps) {
  const [name, setName] = useState(asset.name);
  const [description, setDescription] = useState(asset.description || '');
  const [alt, setAlt] = useState(asset.alt || '');
  const [isMosaicDefault, setIsMosaicDefault] = useState(asset.isMosaicDefault || false);

  const handleSave = () => {
    onSave({
      id: asset.id,
      name: name !== asset.name ? name : undefined,
      description: description !== (asset.description || '') ? description : undefined,
      alt: alt !== (asset.alt || '') ? alt : undefined,
      isMosaicDefault: isMosaicDefault !== (asset.isMosaicDefault || false) ? isMosaicDefault : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑资源</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">名称</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="资源名称"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">描述</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="资源描述"
              rows={3}
            />
          </div>
          {asset.type === AssetType.IMAGE && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Alt 文本</label>
                <Input
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="图片替代文本"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mosaic-default"
                  checked={isMosaicDefault}
                  onCheckedChange={(checked) => setIsMosaicDefault(checked as boolean)}
                />
                <label htmlFor="mosaic-default" className="text-sm font-medium">
                  默认显示马赛克
                </label>
                <span className="text-xs text-gray-500">
                  (在MDX渲染器中非预览状态下显示马赛克)
                </span>
              </div>
            </>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}