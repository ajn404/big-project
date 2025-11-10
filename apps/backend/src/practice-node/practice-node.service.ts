import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { PracticeNode } from '../database/entities/practice-node.entity';
import { Category } from '../database/entities/category.entity';
import { Tag } from '../database/entities/tag.entity';
import { CreatePracticeNodeInput } from './dto/create-practice-node.input';
import { UpdatePracticeNodeInput } from './dto/update-practice-node.input';
import { TagService } from '../tag/tag.service';

@Injectable()
export class PracticeNodeService {
  constructor(
    @InjectRepository(PracticeNode)
    private practiceNodeRepository: Repository<PracticeNode>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private tagService: TagService,
  ) {}

  async findAll(): Promise<PracticeNode[]> {
    return this.practiceNodeRepository.find({
      relations: ['category', 'tags'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PracticeNode> {
    const practiceNode = await this.practiceNodeRepository.findOne({
      where: { id },
      relations: ['category', 'tags'],
    });

    if (!practiceNode) {
      throw new NotFoundException(`Practice node with ID ${id} not found`);
    }

    return practiceNode;
  }

  async search(query?: string, categoryName?: string, tagNames?: string[]): Promise<PracticeNode[]> {
    const queryBuilder = this.practiceNodeRepository
      .createQueryBuilder('practiceNode')
      .leftJoinAndSelect('practiceNode.category', 'category')
      .leftJoinAndSelect('practiceNode.tags', 'tags');

    if (query) {
      queryBuilder.andWhere(
        '(practiceNode.title ILIKE :query OR practiceNode.description ILIKE :query)',
        { query: `%${query}%` }
      );
    }

    if (categoryName) {
      queryBuilder.andWhere('category.name = :categoryName', { categoryName });
    }

    if (tagNames && tagNames.length > 0) {
      queryBuilder.andWhere('tags.name IN (:...tagNames)', { tagNames });
    }

    queryBuilder.orderBy('practiceNode.date', 'DESC');

    return queryBuilder.getMany();
  }

  async create(createPracticeNodeInput: CreatePracticeNodeInput): Promise<PracticeNode> {
    const { categoryName, tagNames, ...practiceNodeData } = createPracticeNodeInput;

    // 查找或创建分类
    let category = await this.categoryRepository.findOne({ where: { name: categoryName } });
    if (!category) {
      category = this.categoryRepository.create({
        name: categoryName,
        description: `${categoryName} 相关实践`,
        color: '#3B82F6',
        order: 0,
      });
      await this.categoryRepository.save(category);
    }

    // 查找或创建标签
    const tags: Tag[] = [];
    for (const tagName of tagNames) {
      let tag = await this.tagRepository.findOne({ where: { name: tagName } });
      if (!tag) {
        tag = this.tagRepository.create({
          name: tagName,
          color: '#10B981',
        });
        await this.tagRepository.save(tag);
      }
      tags.push(tag);
    }

    // 创建实践节点
    const practiceNode = this.practiceNodeRepository.create({
      ...practiceNodeData,
      category,
      tags,
      date: new Date(),
    });

    return this.practiceNodeRepository.save(practiceNode);
  }

  async update(updatePracticeNodeInput: UpdatePracticeNodeInput): Promise<PracticeNode> {
    const { id, categoryName, tagNames, ...updateData } = updatePracticeNodeInput;

    const practiceNode = await this.findOne(id);
    
    // 记录旧标签，用于后续清理
    const oldTagIds = practiceNode.tags.map(tag => tag.id);

    // 更新分类（如果提供）
    if (categoryName) {
      let category = await this.categoryRepository.findOne({ where: { name: categoryName } });
      if (!category) {
        category = this.categoryRepository.create({
          name: categoryName,
          description: `${categoryName} 相关实践`,
          color: '#3B82F6',
          order: 0,
        });
        await this.categoryRepository.save(category);
      }
      practiceNode.category = category;
    }

    // 更新标签（如果提供）
    if (tagNames) {
      const tags: Tag[] = [];
      for (const tagName of tagNames) {
        let tag = await this.tagRepository.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = this.tagRepository.create({
            name: tagName,
            color: '#10B981',
          });
          await this.tagRepository.save(tag);
        }
        tags.push(tag);
      }
      practiceNode.tags = tags;
    }

    // 更新其他字段
    Object.assign(practiceNode, updateData);

    const updatedNode = await this.practiceNodeRepository.save(practiceNode);

    // 清理可能变为无用的旧标签
    if (tagNames) {
      for (const oldTagId of oldTagIds) {
        await this.tagService.removeTagIfUnused(oldTagId);
      }
    }

    return updatedNode;
  }

  async remove(id: string): Promise<boolean> {
    // 先获取要删除的文章及其标签
    const practiceNode = await this.findOne(id);
    const tagIds = practiceNode.tags.map(tag => tag.id);

    // 删除文章
    const result = await this.practiceNodeRepository.delete(id);
    
    if (result.affected > 0) {
      // 清理可能变为无用的标签
      for (const tagId of tagIds) {
        await this.tagService.removeTagIfUnused(tagId);
      }
      
      console.log(`Deleted practice node: ${practiceNode.title}`);
      return true;
    }
    
    return false;
  }

  async findByCategory(categoryName: string): Promise<PracticeNode[]> {
    return this.practiceNodeRepository.find({
      where: { category: { name: categoryName } },
      relations: ['category', 'tags'],
      order: { date: 'DESC' },
    });
  }

  async findByTags(tagNames: string[]): Promise<PracticeNode[]> {
    return this.practiceNodeRepository
      .createQueryBuilder('practiceNode')
      .leftJoinAndSelect('practiceNode.category', 'category')
      .leftJoinAndSelect('practiceNode.tags', 'tags')
      .where('tags.name IN (:...tagNames)', { tagNames })
      .orderBy('practiceNode.date', 'DESC')
      .getMany();
  }
}