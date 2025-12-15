import { AssetManager } from '@/components/asset-manager';
import { Card, CardContent, CardHeader, CardTitle, Button, CardDescription } from '@workspace/ui-components';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ASSET_STATS } from '@/lib/graphql/asset-queries';
import { GET_FOLDER_PATH, MOVE_ASSET_TO_FOLDER } from '@/lib/graphql/folder-queries';
import { AssetStats } from '@/types/asset';
import { useState } from 'react';
import { ChevronRight, Home } from 'lucide-react';

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">资源管理</h1>
          <p className="text-gray-600 mt-1">管理您的图片、文档和媒体文件</p>
        </div>
      </div>

      {/* 统计信息 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总文件数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">图片文件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {(stats.byType as Record<string, number>)['image'] ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">文档文件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(stats.byType as Record<string, number>)['document'] ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">总大小</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatFileSize(stats.totalSize)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 面包屑导航 */}
      <Card >
        <CardContent className="p-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentFolderId(undefined)}
              className="p-1 h-auto"
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
                  className="p-1 h-auto text-gray-600 hover:text-gray-900"
                >
                  {folder.name}
                </Button>
              </div>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* 资源管理器 */}
      <Card>
        <CardHeader>
          <CardTitle>文件库</CardTitle>
          <CardDescription>右键操作，可拖动至文件夹</CardDescription>
        </CardHeader>
        <CardContent>
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