import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

export enum ContentType {
  MDX = 'MDX',
  COMPONENT = 'COMPONENT'
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

registerEnumType(ContentType, {
  name: 'ContentType',
  description: '内容类型',
});

registerEnumType(Difficulty, {
  name: 'Difficulty',
  description: '难度等级',
});

@ObjectType()
@Entity('practice_nodes')
export class PracticeNode {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  description: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  content?: string;

  @Field(() => ContentType)
  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.MDX
  })
  contentType: ContentType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  componentName?: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Field(() => [Tag])
  @ManyToMany(() => Tag, tag => tag.practiceNodes, { eager: true })
  @JoinTable({
    name: 'practice_node_tags',
    joinColumn: { name: 'practice_node_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: Tag[];

  @Field(() => Category)
  @ManyToOne(() => Category, category => category.practiceNodes, { eager: true })
  category: Category;

  @Field(() => Difficulty)
  @Column({
    type: 'enum',
    enum: Difficulty,
    default: Difficulty.BEGINNER
  })
  difficulty: Difficulty;

  @Field(() => Int)
  @Column({ default: 30 })
  estimatedTime: number;

  @Field(() => [String])
  @Column('text', { array: true, default: [] })
  prerequisites: string[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}