import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

export enum AssetType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AUDIO = 'audio',
  OTHER = 'other',
}

registerEnumType(AssetType, {
  name: 'AssetType',
  description: '资源类型',
});

@Entity('assets')
@ObjectType()
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  originalName: string;

  @Column()
  @Field()
  url: string;

  @Column()
  @Field()
  mimeType: string;

  @Column('bigint')
  @Field()
  size: number;

  @Column({
    type: 'enum',
    enum: AssetType,
  })
  @Field(() => AssetType)
  type: AssetType;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  alt?: string;

  @Column({ type: 'json', nullable: true })
  @Field(() => GraphQLJSONObject, { nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  @Field({ nullable: true })
  isMosaicDefault?: boolean;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  folderId?: string;

  @ManyToOne('Folder', { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'folderId' })
  folder?: any;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}