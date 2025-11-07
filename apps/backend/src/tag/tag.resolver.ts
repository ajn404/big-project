import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Tag } from '../database/entities/tag.entity';
import { TagService } from './tag.service';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(() => [Tag], { name: 'tags' })
  findAll() {
    return this.tagService.findAll();
  }

  @Query(() => Tag, { name: 'tag' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.tagService.findOne(id);
  }
}