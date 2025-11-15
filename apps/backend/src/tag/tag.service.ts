import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../database/entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find({
      relations: ['practiceNodes'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Tag> {
    return this.tagRepository.findOne({
      where: { id },
      relations: ['practiceNodes'],
    });
  }

  async findByName(name: string): Promise<Tag> {
    return this.tagRepository.findOne({
      where: { name },
    });
  }

  async findByNames(names: string[]): Promise<Tag[]> {
    if (!names || names.length === 0) {
      return [];
    }
    return this.tagRepository.find({
      where: names.map(name => ({ name })),
    });
  }

  async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    if (!tagNames || tagNames.length === 0) {
      return [];
    }

    const tags: Tag[] = [];
    
    for (const tagName of tagNames) {
      if (!tagName.trim()) continue;
      
      let tag = await this.findByName(tagName.trim());
      
      if (!tag) {
        // Create new tag with random color
        const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
        tag = this.tagRepository.create({
          name: tagName.trim(),
          color: colors[Math.floor(Math.random() * colors.length)]
        });
        tag = await this.tagRepository.save(tag);
      }
      
      tags.push(tag);
    }

    return tags;
  }

  // 清理没有关联文章的标签
  async cleanupUnusedTags(): Promise<void> {
    const allTags = await this.tagRepository.find({
      relations: ['practiceNodes'],
    });

    const unusedTags = allTags.filter(tag => 
      !tag.practiceNodes || tag.practiceNodes.length === 0
    );

    if (unusedTags.length > 0) {
      await this.tagRepository.remove(unusedTags);
      console.log(`Cleaned up ${unusedTags.length} unused tags:`, unusedTags.map(t => t.name));
    }
  }

  // 检查特定标签是否还有关联的文章
  async removeTagIfUnused(tagId: string): Promise<void> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
      relations: ['practiceNodes'],
    });

    if (tag && (!tag.practiceNodes || tag.practiceNodes.length === 0)) {
      await this.tagRepository.remove(tag);
      console.log(`Removed unused tag: ${tag.name}`);
    }
  }
}