import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

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

registerEnumType(ComponentCategory, {
  name: 'ComponentCategory',
  description: '组件分类',
});

registerEnumType(ComponentStatus, {
  name: 'ComponentStatus',
  description: '组件状态',
});

@ObjectType()
@Entity('ui_components')
export class UIComponent {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column('text')
  description: string;

  @Field(() => ComponentCategory)
  @Column({
    type: 'enum',
    enum: ComponentCategory,
    default: ComponentCategory.UI_COMPONENT
  })
  category: ComponentCategory;

  @Field()
  @Column('text')
  template: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  preview?: string;

  @Field()
  @Column({ default: '1.0.0' })
  version: string;

  @Field()
  @Column({ default: 'System' })
  author: string;

  @Field(() => ComponentStatus)
  @Column({
    type: 'enum',
    enum: ComponentStatus,
    default: ComponentStatus.ACTIVE
  })
  status: ComponentStatus;

  @Field(() => [String])
  @Column('text', { array: true, default: [] })
  props: string[];

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  propsSchema?: string; // JSON schema for component props

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  documentation?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  examples?: string; // JSON string containing example configurations

  @Field(() => [Tag])
  @ManyToMany(() => Tag, tag => tag.uiComponents, { eager: true })
  @JoinTable({
    name: 'ui_component_tags',
    joinColumn: { name: 'ui_component_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: Tag[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}

import { Tag } from './tag.entity';
