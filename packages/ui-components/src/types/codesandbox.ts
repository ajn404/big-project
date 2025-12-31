// CodeSandbox SDK 相关类型定义

export interface CodeSandboxFile {
  code: string
  isBinary?: boolean
}

export interface CodeSandboxFiles {
  [path: string]: CodeSandboxFile
}

export interface CodeSandboxTemplate {
  name: string
  description: string
  files: CodeSandboxFiles
}

export interface CodeSandboxCreateParams {
  /** 文件内容 */
  files: CodeSandboxFiles
  /** 模板类型 */
  template?: string
  /** 沙箱标题 */
  title?: string
  /** 沙箱描述 */
  description?: string
  /** 是否公开 */
  public?: boolean
  /** 标签 */
  tags?: string[]
  /** 依赖 */
  dependencies?: Record<string, string>
  /** 开发依赖 */
  devDependencies?: Record<string, string>
}

export interface CodeSandboxInstance {
  /** 沙箱 ID */
  id: string
  /** 沙箱 URL */
  url: string
  /** 嵌入 URL */
  embedUrl: string
  /** 编辑器 URL */
  editorUrl: string
  /** 预览 URL */
  previewUrl: string
  /** 沙箱信息 */
  title: string
  description: string
  /** 作者信息 */
  author?: {
    username: string
    name?: string
    avatarUrl?: string
  }
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
  /** 是否为模板 */
  isTemplate: boolean
  /** 标签 */
  tags: string[]
  /** 点赞数 */
  likeCount: number
  /** 浏览数 */
  viewCount: number
  /** 分支数 */
  forkCount: number
}

export interface CodeSandboxEmbedOptions {
  /** 主题 */
  theme?: 'light' | 'dark' | 'auto'
  /** 视图模式 */
  view?: 'editor' | 'preview' | 'split'
  /** 字体大小 */
  fontsize?: number
  /** 是否隐藏导航 */
  hidenavigation?: boolean
  /** 是否隐藏编辑器 */
  hideeditor?: boolean
  /** 是否隐藏预览 */
  hidepreview?: boolean
  /** 是否隐藏控制台 */
  hideconsole?: boolean
  /** 是否隐藏测试 */
  hidetests?: boolean
  /** 是否显示文件浏览器 */
  expanddevtools?: boolean
  /** 自动运行 */
  autorun?: boolean
  /** 强制刷新 */
  forcerefresh?: boolean
  /** 初始路径 */
  initialpath?: string
  /** 模块路径 */
  module?: string
  /** 高亮行 */
  highlights?: string
  /** 是否可编辑 */
  readonly?: boolean
}

export interface CodeSandboxSDKError {
  message: string
  code?: string | number
  details?: any
}

export interface CodeSandboxSearchParams {
  /** 搜索查询 */
  query?: string
  /** 页码 */
  page?: number
  /** 每页数量 */
  per_page?: number
  /** 排序字段 */
  sort?: 'created' | 'updated' | 'title' | 'view_count' | 'like_count'
  /** 排序方向 */
  direction?: 'asc' | 'desc'
  /** 标签筛选 */
  tags?: string[]
  /** 模板筛选 */
  template?: string
  /** 作者筛选 */
  username?: string
}

export interface CodeSandboxSearchResult {
  /** 沙箱列表 */
  sandboxes: CodeSandboxInstance[]
  /** 总数 */
  total: number
  /** 当前页 */
  page: number
  /** 每页数量 */
  per_page: number
  /** 总页数 */
  total_pages: number
}

// 预定义模板类型
export type TemplateType = 
  | 'vanilla' 
  | 'vanilla-ts' 
  | 'react' 
  | 'react-ts' 
  | 'vue' 
  | 'vue-ts' 
  | 'angular' 
  | 'svelte' 
  | 'solid' 
  | 'preact' 
  | 'node'
  | 'nextjs'
  | 'nuxtjs'
  | 'gatsby'
  | 'create-react-app'

// 语言类型
export type LanguageType = 
  | 'javascript' 
  | 'typescript' 
  | 'html' 
  | 'css' 
  | 'scss' 
  | 'less' 
  | 'json' 
  | 'markdown'
  | 'yaml'
  | 'toml'

// 主题类型
export type ThemeType = 'light' | 'dark' | 'auto'

// 视图模式
export type ViewMode = 'editor' | 'preview' | 'console' | 'problems' | 'tests'

// 布局模式
export type LayoutMode = 'responsive' | 'fixed'