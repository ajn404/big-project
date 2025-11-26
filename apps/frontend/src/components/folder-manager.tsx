import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Card,
  CardContent,
  Textarea,
  useConfirm,
} from '@workspace/ui-components';
import {
  FolderPlus,
  Folder as FolderIcon,
  Edit,
  Trash2,
  ChevronRight,
  Home,
} from 'lucide-react';
import {
  GET_FOLDERS,
  CREATE_FOLDER,
  UPDATE_FOLDER,
  REMOVE_FOLDER,
  GET_FOLDER_ASSET_COUNT,
} from '@/lib/graphql/folder-queries';
import { Folder, CreateFolderInput, UpdateFolderInput } from '@/types/folder';

interface FolderManagerProps {
  currentFolderId?: string;
  onFolderSelect?: (folder: Folder | null) => void;
  onCreateFolder?: () => void;
  onMoveAsset?: (assetId: string, folderId?: string) => void;
}

const FOLDER_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
];

export function FolderManager({ currentFolderId, onFolderSelect, onCreateFolder, onMoveAsset }: FolderManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const { confirm, ConfirmDialog } = useConfirm();

  const { data, loading, refetch } = useQuery(GET_FOLDERS, {
    variables: { parentId: currentFolderId },
  });

  const [createFolder] = useMutation(CREATE_FOLDER, {
    onCompleted: () => {
      setShowCreateDialog(false);
      refetch();
      onCreateFolder?.();
    },
  });

  const [updateFolder] = useMutation(UPDATE_FOLDER, {
    onCompleted: () => {
      setEditingFolder(null);
      refetch();
    },
  });

  const [removeFolder] = useMutation(REMOVE_FOLDER, {
    onCompleted: () => refetch(),
  });

  const handleCreateFolder = useCallback(async (input: CreateFolderInput) => {
    await createFolder({
      variables: {
        input: { ...input, parentId: currentFolderId },
      },
    });
  }, [createFolder, currentFolderId]);

  const handleUpdateFolder = useCallback(async (input: UpdateFolderInput) => {
    await updateFolder({ variables: { input } });
  }, [updateFolder]);

  const handleDeleteFolder = useCallback(async (id: string) => {
    const confirmed = await confirm({
      title: '删除文件夹',
      description: '确定要删除这个文件夹吗？文件夹必须为空才能删除。',
      confirmText: '删除',
      cancelText: '取消',
      variant: 'destructive'
    });
    
    if (confirmed) {
      try {
        await removeFolder({ variables: { id } });
      } catch (error: any) {
        alert(error.message || '删除失败');
      }
    }
  }, [removeFolder, confirm]);

  const folders = data?.folders || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <FolderIcon className="w-5 h-5 " />
          文件夹
        </h3>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <FolderPlus className="w-4 h-4 mr-2" />
              新建文件夹
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新文件夹</DialogTitle>
            </DialogHeader>
            <CreateFolderForm onSubmit={handleCreateFolder} />
          </DialogContent>
        </Dialog>
      </div>

      {/* 返回上级按钮 */}
      {currentFolderId && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => onFolderSelect?.(null)}
        >
          <Home className="w-4 h-4 mr-2" />
          返回根目录
        </Button>
      )}

      {/* 文件夹列表 */}
      <div className="space-y-2 h-[calc(100vh-500px)] overflow-auto">
        {loading ? (
          <div>加载中...</div>
        ) : folders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无文件夹
          </div>
        ) : (
          folders.map((folder: Folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onSelect={() => onFolderSelect?.(folder)}
              onEdit={() => setEditingFolder(folder)}
              onDelete={() => handleDeleteFolder(folder.id)}
              onMoveAsset={onMoveAsset}
            />
          ))
        )}
      </div>

      {/* 编辑对话框 */}
      {editingFolder && (
        <Dialog open={!!editingFolder} onOpenChange={(open) => !open && setEditingFolder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑文件夹</DialogTitle>
            </DialogHeader>
            <EditFolderForm
              folder={editingFolder}
              onSubmit={handleUpdateFolder}
              onCancel={() => setEditingFolder(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}

interface FolderCardProps {
  folder: Folder;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveAsset?: (assetId: string, folderId?: string) => void;
}

function FolderCard({ folder, onSelect, onEdit, onDelete, onMoveAsset }: FolderCardProps) {
  const { data: assetCountData } = useQuery(GET_FOLDER_ASSET_COUNT, {
    variables: { folderId: folder.id },
  });
  const assetCount = assetCountData?.assets?.length || 0;
  const childCount = folder.children?.length || 0;
  const [isDropTarget, setIsDropTarget] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(false);
    
    const assetId = e.dataTransfer.getData('text/plain');
    if (assetId && onMoveAsset) {
      onMoveAsset(assetId, folder.id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(false);
  };

  return (
    <Card 
      className={`group cursor-pointer hover:shadow-md transition-all ${
        isDropTarget ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1" onClick={onSelect}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: folder.color }}
            >
              <FolderIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{folder.name}</h4>
              <p className="text-sm text-gray-500">
                {assetCount} 个文件 · {childCount} 个子文件夹
              </p>
              {folder.description && (
                <p className="text-xs text-gray-400 truncate mt-1">
                  {folder.description}
                </p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CreateFolderFormProps {
  onSubmit: (input: CreateFolderInput) => void;
}

function CreateFolderForm({ onSubmit }: CreateFolderFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(FOLDER_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      color,
    });

    setName('');
    setDescription('');
    setColor(FOLDER_COLORS[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">名称</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入文件夹名称"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">描述</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="可选的文件夹描述"
          rows={3}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">颜色</label>
        <div className="flex gap-2">
          {FOLDER_COLORS.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${
                color === colorOption ? 'border-gray-400' : 'border-transparent'
              }`}
              style={{ backgroundColor: colorOption }}
              onClick={() => setColor(colorOption)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit">创建文件夹</Button>
      </div>
    </form>
  );
}

interface EditFolderFormProps {
  folder: Folder;
  onSubmit: (input: UpdateFolderInput) => void;
  onCancel: () => void;
}

function EditFolderForm({ folder, onSubmit, onCancel }: EditFolderFormProps) {
  const [name, setName] = useState(folder.name);
  const [description, setDescription] = useState(folder.description || '');
  const [color, setColor] = useState(folder.color);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      id: folder.id,
      name: name.trim(),
      description: description.trim() || undefined,
      color,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">名称</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入文件夹名称"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">描述</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="可选的文件夹描述"
          rows={3}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">颜色</label>
        <div className="flex gap-2">
          {FOLDER_COLORS.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              className={`w-8 h-8 rounded-full border-2 ${
                color === colorOption ? 'border-gray-400' : 'border-transparent'
              }`}
              style={{ backgroundColor: colorOption }}
              onClick={() => setColor(colorOption)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
}