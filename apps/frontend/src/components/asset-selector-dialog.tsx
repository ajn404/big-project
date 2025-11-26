import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui-components';
import { AssetManager } from './asset-manager';
import { Asset, AssetType } from '@/types/asset';

interface AssetSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: Asset) => void;
  allowedTypes?: AssetType[];
  title?: string;
}

export function AssetSelectorDialog({
  open,
  onOpenChange,
  onSelect,
  allowedTypes = [AssetType.IMAGE],
  title = '选择资源'
}: AssetSelectorDialogProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>();
  const handleSelect = (asset: Asset) => {
    onSelect(asset);
    onOpenChange(false);
  };
  const handleFolderChange = (folderId: string | undefined) => {
    setCurrentFolderId(folderId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <AssetManager
            onSelect={handleSelect}
            selectionMode={true}
            allowedTypes={allowedTypes}
            currentFolderId={currentFolderId}
            onFolderChange={handleFolderChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}