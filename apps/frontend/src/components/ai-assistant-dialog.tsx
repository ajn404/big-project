import { useState } from 'react';
import { Dialog, Button, Textarea, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@workspace/ui-components';
import { Bot, Sparkles, FileText, Loader2, Copy, Check } from 'lucide-react';
import { useAIWritingAssist, useAISummarize } from '@/hooks/useAI';

interface AIAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentContent: string;
  onContentReplace: (newContent: string) => void;
  onContentInsert: (content: string) => void;
}

type AIAction = 'writing_assist' | 'summarize';

export function AIAssistantDialog({
  open,
  onOpenChange,
  currentContent,
  onContentReplace,
  onContentInsert,
}: AIAssistantDialogProps) {
  const [activeAction, setActiveAction] = useState<AIAction>('writing_assist');
  const [instruction, setInstruction] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [summarizeLength, setSummarizeLength] = useState<'short' | 'medium' | 'long'>('medium');

  const { assistWriting, isLoading: isWritingLoading, error: writingError } = useAIWritingAssist();
  const { summarizeContent, isLoading: isSummarizeLoading, error: summarizeError } = useAISummarize();

  const isLoading = isWritingLoading || isSummarizeLoading;
  const error = writingError || summarizeError;

  const handleWritingAssist = async () => {
    if (!currentContent.trim() || !instruction.trim()) return;

    const response = await assistWriting(currentContent, instruction);
    if (response) {
      setResult(response.content);
    }
  };

  const handleSummarize = async () => {
    if (!currentContent.trim()) return;

    const response = await summarizeContent(currentContent, summarizeLength);
    if (response) {
      setResult(response.content);
    }
  };

  const handleExecute = () => {
    if (activeAction === 'writing_assist') {
      handleWritingAssist();
    } else {
      handleSummarize();
    }
  };

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const handleReplaceContent = () => {
    if (result) {
      onContentReplace(result);
      onOpenChange(false);
    }
  };

  const handleInsertContent = () => {
    if (result) {
      onContentInsert(result);
      onOpenChange(false);
    }
  };

  const resetDialog = () => {
    setResult('');
    setInstruction('');
    setActiveAction('writing_assist');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent
        onEscapeKeyDown={(e) => { e.preventDefault(); e.stopPropagation() }}
        className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI 写作助手
          </DialogTitle>
          <DialogDescription>
            使用 AI 来改进你的内容或生成摘要
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* 左侧：控制面板 */}
            <div className="space-y-4">
              {/* 功能选择 */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    variant={activeAction === 'writing_assist' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveAction('writing_assist')}
                    className="flex-1"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    写作改进
                  </Button>
                  <Button
                    variant={activeAction === 'summarize' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveAction('summarize')}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    内容总结
                  </Button>
                </div>
              </div>

              {/* 写作改进设置 */}
              {activeAction === 'writing_assist' && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">改进指令</label>
                  <Textarea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder="请描述你希望如何改进这段内容，例如：使语言更加专业、简化表达、增加细节等..."
                    rows={4}
                    className="resize-none"
                  />
                  <div className="text-xs text-muted-foreground">
                    提示：越具体的指令，AI 的改进效果越好
                  </div>
                </div>
              )}

              {/* 总结设置 */}
              {activeAction === 'summarize' && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">总结长度</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'short', label: '简短', desc: '1-2句话' },
                      { value: 'medium', label: '中等', desc: '100-200字' },
                      { value: 'long', label: '详细', desc: '300-500字' },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={summarizeLength === option.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSummarizeLength(option.value as any)}
                        className="flex-1 flex-col h-auto py-2"
                      >
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.desc}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* 原始内容预览 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">当前内容 ({currentContent.length} 字符)</label>
                <div className="max-h-32 overflow-y-auto p-3 bg-muted/50 rounded-md text-sm">
                  {currentContent.trim() || '没有内容'}
                </div>
              </div>

              {/* 执行按钮 */}
              <Button
                onClick={handleExecute}
                disabled={
                  isLoading ||
                  !currentContent.trim() ||
                  (activeAction === 'writing_assist' && !instruction.trim())
                }
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    AI 处理中...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-2" />
                    {activeAction === 'writing_assist' ? '开始改进' : '开始总结'}
                  </>
                )}
              </Button>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">
                    {error.message || 'AI 处理失败，请稍后重试'}
                  </p>
                </div>
              )}
            </div>

            {/* 右侧：结果展示 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">AI 处理结果</label>
                {result && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="h-64 md:h-80 overflow-y-auto p-4 bg-background border rounded-md">
                {result ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {result}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">点击上方按钮开始 AI 处理</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              {result && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleReplaceContent}
                    variant="default"
                    className="flex-1"
                  >
                    替换原内容
                  </Button>
                  <Button
                    onClick={handleInsertContent}
                    variant="outline"
                    className="flex-1"
                  >
                    插入到光标位置
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}