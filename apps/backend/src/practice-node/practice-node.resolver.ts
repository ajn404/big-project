import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PracticeNode } from '../database/entities/practice-node.entity';
import { PracticeNodeService } from './practice-node.service';
import { CreatePracticeNodeInput } from './dto/create-practice-node.input';
import { UpdatePracticeNodeInput } from './dto/update-practice-node.input';

@Resolver(() => PracticeNode)
export class PracticeNodeResolver {
  constructor(private readonly practiceNodeService: PracticeNodeService) {}

  @Query(() => [PracticeNode], { name: 'practiceNodes' })
  findAll() {
    return this.practiceNodeService.findAll();
  }

  @Query(() => PracticeNode, { name: 'practiceNode' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.practiceNodeService.findOne(id);
  }

  @Query(() => [PracticeNode], { name: 'searchPracticeNodes' })
  search(
    @Args('query', { nullable: true }) query?: string,
    @Args('categoryName', { nullable: true }) categoryName?: string,
    @Args('tagNames', { type: () => [String], nullable: true }) tagNames?: string[],
  ) {
    return this.practiceNodeService.search(query, categoryName, tagNames);
  }

  @Query(() => [PracticeNode], { name: 'practiceNodesByCategory' })
  findByCategory(@Args('categoryName') categoryName: string) {
    return this.practiceNodeService.findByCategory(categoryName);
  }

  @Query(() => [PracticeNode], { name: 'practiceNodesByTags' })
  findByTags(@Args('tagNames', { type: () => [String] }) tagNames: string[]) {
    return this.practiceNodeService.findByTags(tagNames);
  }

  @Mutation(() => PracticeNode)
  createPracticeNode(@Args('createPracticeNodeInput') createPracticeNodeInput: CreatePracticeNodeInput) {
    return this.practiceNodeService.create(createPracticeNodeInput);
  }

  @Mutation(() => PracticeNode)
  updatePracticeNode(@Args('updatePracticeNodeInput') updatePracticeNodeInput: UpdatePracticeNodeInput) {
    return this.practiceNodeService.update(updatePracticeNodeInput);
  }

  @Mutation(() => Boolean)
  removePracticeNode(@Args('id', { type: () => ID }) id: string) {
    return this.practiceNodeService.remove(id);
  }
}