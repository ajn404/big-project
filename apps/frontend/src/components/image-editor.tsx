import  { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@workspace/ui-components';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-components';
import { Slider } from '@workspace/ui-components';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@workspace/ui-components';
import { 
  RotateCw, 
  RotateCcw, 
  FlipHorizontal, 
  FlipVertical,
  Download,
  Undo,
  Redo
} from 'lucide-react';

interface ImageEditorProps {
  imageUrl: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (editedImageBlob: Blob) => void;
}

interface EditState {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const defaultState: EditState = {
  rotation: 0,
  flipH: false,
  flipV: false,
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

export function ImageEditor({ imageUrl, open, onOpenChange, onSave }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [editState, setEditState] = useState<EditState>(defaultState);
  const [history, setHistory] = useState<EditState[]>([defaultState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [, setCropMode] = useState(false);

  // 重置状态
  const resetState = useCallback(() => {
    setEditState(defaultState);
    setHistory([defaultState]);
    setHistoryIndex(0);
    setCropMode(false);
  }, []);

  // 当对话框打开时重置状态
  useEffect(() => {
    if (open) {
      resetState();
      setIsLoading(true);
    }
  }, [open, resetState]);

  // 添加历史记录
  const addToHistory = useCallback((newState: EditState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setEditState(newState);
  }, [history, historyIndex]);

  // 撤销
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setEditState(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // 重做
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setEditState(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // 应用编辑到画布
  const applyEdits = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 保存上下文状态
    ctx.save();

    // 应用变换
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.translate(centerX, centerY);
    
    // 旋转
    ctx.rotate((editState.rotation * Math.PI) / 180);
    
    // 翻转
    const scaleX = editState.flipH ? -1 : 1;
    const scaleY = editState.flipV ? -1 : 1;
    ctx.scale(scaleX, scaleY);

    // 应用滤镜
    const filters = [
      `brightness(${editState.brightness}%)`,
      `contrast(${editState.contrast}%)`,
      `saturate(${editState.saturation}%)`
    ];
    ctx.filter = filters.join(' ');

    // 绘制图片
    ctx.drawImage(image, -centerX, -centerY);

    // 恢复上下文状态
    ctx.restore();
  }, [editState]);

  // 当编辑状态改变时重新绘制
  useEffect(() => {
    if (!isLoading) {
      applyEdits();
    }
  }, [editState, isLoading, applyEdits]);

  // 图片加载完成
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    applyEdits();
  }, [applyEdits]);

  // 旋转
  const rotate = useCallback((degrees: number) => {
    const newState = {
      ...editState,
      rotation: (editState.rotation + degrees) % 360
    };
    addToHistory(newState);
  }, [editState, addToHistory]);

  // 翻转
  const flip = useCallback((direction: 'horizontal' | 'vertical') => {
    const newState = {
      ...editState,
      [direction === 'horizontal' ? 'flipH' : 'flipV']: !editState[direction === 'horizontal' ? 'flipH' : 'flipV']
    };
    addToHistory(newState);
  }, [editState, addToHistory]);

  // 调整滤镜
  const adjustFilter = useCallback((filter: 'brightness' | 'contrast' | 'saturation', value: number) => {
    const newState = {
      ...editState,
      [filter]: value
    };
    setEditState(newState);
  }, [editState]);

  // 完成滤镜调整（用于添加到历史记录）
  const finishFilterAdjust = useCallback(() => {
    addToHistory(editState);
  }, [editState, addToHistory]);

  // 导出图片
  const exportImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob && onSave) {
        onSave(blob);
      }
    }, 'image/png');
  }, [onSave]);

  // 下载图片
  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>图片编辑器</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 h-[70vh]">
          {/* 工具面板 */}
          <div className="w-64 space-y-4 overflow-y-auto">
            {/* 基础操作 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">基础操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={undo}
                    disabled={historyIndex === 0}
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={redo}
                    disabled={historyIndex === history.length - 1}
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 变换 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">变换</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rotate(90)}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rotate(-90)}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => flip('horizontal')}
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => flip('vertical')}
                  >
                    <FlipVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 调整 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">调整</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium">亮度</label>
                  <Slider
                    value={[editState.brightness]}
                    onValueChange={(values) => adjustFilter('brightness', values[0])}
                    onValueCommit={() => finishFilterAdjust()}
                    min={0}
                    max={200}
                    step={1}
                    className="mt-1"
                  />
                  <div className="text-xs text-gray-500 mt-1">{editState.brightness}%</div>
                </div>
                
                <div>
                  <label className="text-xs font-medium">对比度</label>
                  <Slider
                    value={[editState.contrast]}
                    onValueChange={(values) => adjustFilter('contrast', values[0])}
                    onValueCommit={() => finishFilterAdjust()}
                    min={0}
                    max={200}
                    step={1}
                    className="mt-1"
                  />
                  <div className="text-xs text-gray-500 mt-1">{editState.contrast}%</div>
                </div>
                
                <div>
                  <label className="text-xs font-medium">饱和度</label>
                  <Slider
                    value={[editState.saturation]}
                    onValueChange={(values) => adjustFilter('saturation', values[0])}
                    onValueCommit={() => finishFilterAdjust()}
                    min={0}
                    max={200}
                    step={1}
                    className="mt-1"
                  />
                  <div className="text-xs text-gray-500 mt-1">{editState.saturation}%</div>
                </div>
              </CardContent>
            </Card>

            {/* 导出 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">导出</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  size="sm"
                  onClick={downloadImage}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  下载
                </Button>
                {onSave && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportImage}
                    className="w-full"
                  >
                    保存更改
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 编辑区域 */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
            <div className="relative">
              {/* 原始图片（隐藏，用于获取尺寸） */}
              <img
                ref={imageRef}
                src={imageUrl}
                onLoad={handleImageLoad}
                style={{ display: 'none' }}
                alt="Original"
              />
              
              {/* 编辑画布 */}
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full shadow-lg"
                style={{
                  display: isLoading ? 'none' : 'block'
                }}
              />
              
              {/* 加载状态 */}
              {isLoading && (
                <div className="flex items-center justify-center w-96 h-64">
                  <div className="text-gray-500">加载中...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}