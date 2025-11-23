/**
 * 统一的标题ID生成函数
 * 确保目录组件和MDX渲染器使用相同的ID生成规则
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    // 替换所有非字母数字和中文字符为连字符
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    // 移除开头和结尾的连字符
    .replace(/^-+|-+$/g, '')
    // 将多个连续连字符替换为单个
    .replace(/-+/g, '-')
}