import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Category } from '../database/entities/category.entity';
import { CategoryService } from './category.service';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category], { name: 'categories' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Query(() => Category, { name: 'category' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.findOne(id);
  }
}