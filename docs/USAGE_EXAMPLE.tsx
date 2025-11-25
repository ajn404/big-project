// 在任何项目中使用共享 shadcn 组件的示例

import React from 'react'
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Textarea,
  cn // 工具函数
} from '@workspace/ui-components'

export function SharedComponentsDemo() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">共享 Shadcn 组件演示</h1>
      
      {/* 按钮示例 */}
      <Card>
        <CardHeader>
          <CardTitle>按钮组件</CardTitle>
        </CardHeader>
        <CardContent className="space-x-2">
          <Button variant="default">默认按钮</Button>
          <Button variant="secondary">次要按钮</Button>
          <Button variant="outline">轮廓按钮</Button>
          <Button variant="ghost">幽灵按钮</Button>
        </CardContent>
      </Card>

      {/* 表单组件示例 */}
      <Card>
        <CardHeader>
          <CardTitle>表单组件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="输入框示例" 
            className="w-full" 
          />
          
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择一个选项" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">选项 1</SelectItem>
              <SelectItem value="option2">选项 2</SelectItem>
              <SelectItem value="option3">选项 3</SelectItem>
            </SelectContent>
          </Select>
          
          <Textarea 
            placeholder="文本域示例" 
            className="w-full" 
          />
        </CardContent>
      </Card>

      {/* 对话框示例 */}
      <Card>
        <CardHeader>
          <CardTitle>对话框组件</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">打开对话框</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>共享组件对话框</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>这是一个从共享 UI 包导入的对话框组件。</p>
                <div className="flex space-x-2">
                  <Badge variant="default">共享组件</Badge>
                  <Badge variant="secondary">类型安全</Badge>
                  <Badge variant="outline">易于使用</Badge>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* 组合使用示例 */}
      <Card>
        <CardHeader>
          <CardTitle>组合使用示例</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-4",
            "p-4 border rounded-lg bg-gray-50"
          )}>
            <div className="space-y-2">
              <Input placeholder="姓名" />
              <Input placeholder="邮箱" type="email" />
            </div>
            <div className="space-y-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">管理员</SelectItem>
                  <SelectItem value="user">普通用户</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full">
                提交表单
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 使用方法说明
/*
使用共享 shadcn 组件的步骤：

1. 导入组件
import { Button, Card, Input } from '@workspace/ui-components'

2. 直接使用（与之前完全一样）
<Button variant="primary">点击我</Button>

3. 组合使用
import { cn } from '@workspace/ui-components'
<div className={cn("base-class", "additional-class")}>

优势：
✅ 统一的 UI 组件库
✅ 完整的 TypeScript 支持
✅ 自动的 Tree Shaking
✅ 一次更新，全项目生效
✅ 更好的代码复用

*/