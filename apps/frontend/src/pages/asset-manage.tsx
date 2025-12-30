import { AssetManager } from '@/components/asset-manager';
import { Card, CardContent, CardHeader, CardTitle, Button, CardDescription } from '@workspace/ui-components';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ASSET_STATS } from '@/lib/graphql/asset-queries';
import { GET_FOLDER_PATH, MOVE_ASSET_TO_FOLDER } from '@/lib/graphql/folder-queries';
import { AssetStats } from '@/types/asset';
import { useState } from 'react';
import { ChevronRight, Home, FolderOpen, FileText, Image, FileText as FileIcon } from 'lucide-react';

export default function AssetManagePage() {
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>();

  const { data: statsData } = useQuery(GET_ASSET_STATS);
  const stats: AssetStats | undefined = statsData?.assetStats;

  const { data: folderPathData } = useQuery(GET_FOLDER_PATH, {
    variables: { folderId: currentFolderId },
    skip: !currentFolderId,
  });
  const folderPath = folderPathData?.getFolderPath || [];

  const [moveAssetToFolder] = useMutation(MOVE_ASSET_TO_FOLDER, {
    refetchQueries: ['GetAssets', 'GetFolders', 'GetFolderAssetCount'],
    awaitRefetchQueries: true,
  });

  const handleMoveAsset = async (assetId: string, folderId?: string) => {
    try {
      await moveAssetToFolder({
        variables: {
          input: { assetId, folderId },
        },
      });
    } catch (error) {
      console.error('移动资产失败:', error);
      alert('移动资产失败，请重试');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Header with gradient background */}
      <div className="rounded-xl bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 p-8 border border-green-100 dark:border-green-900/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">
                资源管理
              </h1>
            </div>
            <p className="text-muted-foreground ml-1">
              管理您的图片、文档和媒体文件
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">总文件数</CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">所有文件</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">图片文件</CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Image className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {(stats.byType as Record<string, number>)['image'] ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">图片资源</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">文档文件</CardTitle>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FileIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {(stats.byType as Record<string, number>)['document'] ?? 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">文档资源</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">总大小</CardTitle>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <FolderOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {formatFileSize(stats.totalSize)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">存储空间</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Breadcrumb Navigation */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="p-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentFolderId(undefined)}
              className="p-1 h-auto hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <Home className="w-4 h-4" />
            </Button>
            {folderPath.map((folder: any) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentFolderId(folder.id)}
                  className="p-1 h-auto text-gray-600 hover:text-gray-900 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  {folder.name}
                </Button>
              </div>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* Enhanced Asset Explorer */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <div>
            <CardTitle className="text-xl">文件库</CardTitle>
            <CardDescription className="mt-1">右键操作，可拖动至文件夹</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <AssetManager
            currentFolderId={currentFolderId}
            onFolderChange={setCurrentFolderId}
            onMoveAsset={handleMoveAsset}
          />
        </CardContent>
      </Card>
    </div>
  );
}