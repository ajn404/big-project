import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity('folders')
@ObjectType()
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  parentId?: string;

  @ManyToOne(() => Folder, folder => folder.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  @Field(() => Folder, { nullable: true })
  parent?: Folder;

  @OneToMany(() => Folder, folder => folder.parent)
  @Field(() => [Folder])
  children: Folder[];

  @OneToMany('Asset', 'folder')
  assets: any[];

  @Column({ default: '#3b82f6' })
  @Field()
  color: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}