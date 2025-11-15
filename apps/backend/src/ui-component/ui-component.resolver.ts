import { Resolver, Query, Mutation, Args, ID, ObjectType, Field, Int } from '@nestjs/graphql';
import { UIComponent, ComponentCategory, ComponentStatus } from '../database/entities/ui-component.entity';
import { UIComponentService } from './ui-component.service';
import { CreateUIComponentInput } from './dto/create-ui-component.input';
import { UpdateUIComponentInput } from './dto/update-ui-component.input';

@ObjectType()
class ComponentCategoryStats {
  @Field(() => ComponentCategory)
  category: ComponentCategory;

  @Field(() => Int)
  count: number;
}

@ObjectType()
class ComponentStats {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  active: number;

  @Field(() => Int)
  inactive: number;

  @Field(() => Int)
  deprecated: number;

  @Field(() => [ComponentCategoryStats])
  byCategory: ComponentCategoryStats[];
}

@Resolver(() => UIComponent)
export class UIComponentResolver {
  constructor(private readonly uiComponentService: UIComponentService) {}

  @Query(() => [UIComponent], { name: 'uiComponents' })
  findAll() {
    return this.uiComponentService.findAll();
  }

  @Query(() => UIComponent, { name: 'uiComponent' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.uiComponentService.findOne(id);
  }

  @Query(() => UIComponent, { name: 'uiComponentByName' })
  findByName(@Args('name') name: string) {
    return this.uiComponentService.findByName(name);
  }

  @Query(() => [UIComponent], { name: 'uiComponentsByCategory' })
  findByCategory(@Args('category', { type: () => ComponentCategory }) category: ComponentCategory) {
    return this.uiComponentService.findByCategory(category);
  }

  @Query(() => [UIComponent], { name: 'uiComponentsByStatus' })
  findByStatus(@Args('status', { type: () => ComponentStatus }) status: ComponentStatus) {
    return this.uiComponentService.findByStatus(status);
  }

  @Query(() => [UIComponent], { name: 'uiComponentsByTags' })
  findByTags(@Args('tagNames', { type: () => [String] }) tagNames: string[]) {
    return this.uiComponentService.findByTags(tagNames);
  }

  @Query(() => [UIComponent], { name: 'searchUIComponents' })
  search(
    @Args('query', { nullable: true }) query?: string,
    @Args('category', { type: () => ComponentCategory, nullable: true }) category?: ComponentCategory,
    @Args('tagNames', { type: () => [String], nullable: true }) tagNames?: string[],
    @Args('status', { type: () => ComponentStatus, nullable: true }) status?: ComponentStatus,
  ) {
    return this.uiComponentService.search(query, category, tagNames, status);
  }

  @Query(() => [ComponentCategory], { name: 'componentCategories' })
  getCategories() {
    return this.uiComponentService.getCategories();
  }

  @Query(() => [ComponentStatus], { name: 'componentStatuses' })
  getStatuses() {
    return this.uiComponentService.getStatuses();
  }

  @Query(() => ComponentStats, { name: 'componentStats' })
  getComponentStats() {
    return this.uiComponentService.getComponentStats();
  }

  @Mutation(() => UIComponent)
  createUIComponent(@Args('createUIComponentInput') createUIComponentInput: CreateUIComponentInput) {
    return this.uiComponentService.create(createUIComponentInput);
  }

  @Mutation(() => UIComponent)
  updateUIComponent(@Args('updateUIComponentInput') updateUIComponentInput: UpdateUIComponentInput) {
    return this.uiComponentService.update(updateUIComponentInput);
  }

  @Mutation(() => Boolean)
  removeUIComponent(@Args('id', { type: () => ID }) id: string) {
    return this.uiComponentService.remove(id);
  }
}