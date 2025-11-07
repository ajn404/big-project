// 实践节点相关类型
export interface PracticeNode {
  id: string;
  title: string;
  description: string;
  content?: string;
  contentType: 'MDX' | 'COMPONENT';
  componentName?: string;
  date: Date;
  tags: string[];
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedTime: number; // 预估学习时间（分钟）
  prerequisites?: string[]; // 前置要求
  createdAt: Date;
  updatedAt: Date;
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  order: number;
}

// 标签类型
export interface Tag {
  id: string;
  name: string;
  color: string;
}

// 用户进度类型
export interface UserProgress {
  id: string;
  userId: string;
  practiceNodeId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

// GraphQL 输入类型
export interface CreatePracticeNodeInput {
  title: string;
  description: string;
  content?: string;
  contentType: 'MDX' | 'COMPONENT';
  componentName?: string;
  tags: string[];
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedTime: number;
  prerequisites?: string[];
}

export interface UpdatePracticeNodeInput {
  id: string;
  title?: string;
  description?: string;
  content?: string;
  contentType?: 'MDX' | 'COMPONENT';
  componentName?: string;
  tags?: string[];
  category?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedTime?: number;
  prerequisites?: string[];
}

// 搜索相关类型
export interface SearchFilters {
  category?: string;
  tags?: string[];
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  contentType?: 'MDX' | 'COMPONENT';
}

export interface SearchResult {
  nodes: PracticeNode[];
  total: number;
  page: number;
  pageSize: number;
}

// 主题相关类型
export type ThemeMode = 'light' | 'dark' | 'system';

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// 时间轴相关类型
export interface TimelineItem {
  id: string;
  date: Date;
  title: string;
  description: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  tags: string[];
  href: string;
}

// 导航相关类型
export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  category?: string;
}

// 组件Props相关类型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Three.js 相关类型
export interface ThreeSceneProps {
  animate?: boolean;
  cameraPosition?: [number, number, number];
  lightColor?: string;
  backgroundColor?: string;
}

export interface ThreeObjectProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}