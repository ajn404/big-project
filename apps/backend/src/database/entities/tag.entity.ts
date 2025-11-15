import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { PracticeNode } from './practice-node.entity';


@ObjectType()
@Entity('tags')
export class Tag {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column()
  color: string;

  @Field(() => [PracticeNode])
  @ManyToMany(() => PracticeNode, practiceNode => practiceNode.tags)
  practiceNodes: PracticeNode[];

  @Field(() => [UIComponent])
  @ManyToMany(() => UIComponent, uiComponent => uiComponent.tags)
  uiComponents: UIComponent[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
import { UIComponent } from './ui-component.entity';