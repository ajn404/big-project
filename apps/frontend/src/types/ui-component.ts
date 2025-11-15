export enum ComponentCategory {
  UI_COMPONENT = 'UI组件',
  INTERACTION = '交互组件',
  THREE_D = '3D组件',
  LAYOUT = '布局组件',
  FORM = '表单组件',
  NAVIGATION = '导航组件',
  DATA_DISPLAY = '数据显示',
  FEEDBACK = '反馈组件'
}

export enum ComponentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DEPRECATED = 'DEPRECATED'
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface UIComponent {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  template: string;
  preview?: string;
  version: string;
  author: string;
  status: ComponentStatus;
  props: string[];
  propsSchema?: string;
  documentation?: string;
  examples?: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUIComponentInput {
  name: string;
  description: string;
  category: ComponentCategory;
  template: string;
  preview?: string;
  version: string;
  author: string;
  status: ComponentStatus;
  props: string[];
  propsSchema?: string;
  documentation?: string;
  examples?: string;
  tagNames: string[];
}

export interface UpdateUIComponentInput extends Partial<CreateUIComponentInput> {
  id: string;
}

export interface ComponentCategoryStats {
  category: ComponentCategory;
  count: number;
}

export interface ComponentStats {
  total: number;
  active: number;
  inactive: number;
  deprecated: number;
  byCategory: ComponentCategoryStats[];
}

export interface ComponentExample {
  name: string;
  props: Record<string, any>;
}