import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { PracticeNode } from './practice-node.entity';

@ObjectType()
@Entity('categories')
export class Category {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column('text')
  description: string;

  @Field()
  @Column()
  color: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  icon?: string;

  @Field(() => Int)
  @Column({ default: 0 })
  order: number;

  @Field(() => [PracticeNode])
  @OneToMany(() => PracticeNode, practiceNode => practiceNode.category)
  practiceNodes: PracticeNode[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}