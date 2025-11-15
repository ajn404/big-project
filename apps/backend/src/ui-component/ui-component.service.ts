import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { UIComponent, ComponentCategory, ComponentStatus } from '../database/entities/ui-component.entity';
import { Tag } from '../database/entities/tag.entity';
import { CreateUIComponentInput } from './dto/create-ui-component.input';
import { UpdateUIComponentInput } from './dto/update-ui-component.input';
import { TagService } from '../tag/tag.service';

@Injectable()
export class UIComponentService {
  constructor(
    @InjectRepository(UIComponent)
    private uiComponentRepository: Repository<UIComponent>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private tagService: TagService,
  ) {}

  async findAll(): Promise<UIComponent[]> {
    return this.uiComponentRepository.find({
      relations: ['tags'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<UIComponent> {
    const component = await this.uiComponentRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!component) {
      throw new NotFoundException(`UIComponent with ID ${id} not found`);
    }

    return component;
  }

  async findByName(name: string): Promise<UIComponent> {
    const component = await this.uiComponentRepository.findOne({
      where: { name },
      relations: ['tags'],
    });

    if (!component) {
      throw new NotFoundException(`UIComponent with name ${name} not found`);
    }

    return component;
  }

  async findByCategory(category: ComponentCategory): Promise<UIComponent[]> {
    return this.uiComponentRepository.find({
      where: { category },
      relations: ['tags'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: ComponentStatus): Promise<UIComponent[]> {
    return this.uiComponentRepository.find({
      where: { status },
      relations: ['tags'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTags(tagNames: string[]): Promise<UIComponent[]> {
    if (!tagNames || tagNames.length === 0) {
      return this.findAll();
    }

    return this.uiComponentRepository
      .createQueryBuilder('component')
      .leftJoinAndSelect('component.tags', 'tag')
      .where('tag.name IN (:...tagNames)', { tagNames })
      .orderBy('component.createdAt', 'DESC')
      .getMany();
  }

  async search(
    query?: string,
    category?: ComponentCategory,
    tagNames?: string[],
    status?: ComponentStatus,
  ): Promise<UIComponent[]> {
    const queryBuilder = this.uiComponentRepository
      .createQueryBuilder('component')
      .leftJoinAndSelect('component.tags', 'tag');

    if (query) {
      queryBuilder.andWhere(
        '(component.name ILIKE :query OR component.description ILIKE :query OR component.author ILIKE :query)',
        { query: `%${query}%` }
      );
    }

    if (category) {
      queryBuilder.andWhere('component.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('component.status = :status', { status });
    }

    if (tagNames && tagNames.length > 0) {
      queryBuilder.andWhere('tag.name IN (:...tagNames)', { tagNames });
    }

    return queryBuilder
      .orderBy('component.createdAt', 'DESC')
      .getMany();
  }

  async create(createUIComponentInput: CreateUIComponentInput): Promise<UIComponent> {
    const { tagNames, ...componentData } = createUIComponentInput;

    // Check if component name already exists
    const existingComponent = await this.uiComponentRepository.findOne({
      where: { name: componentData.name },
    });

    if (existingComponent) {
      throw new ConflictException(`Component with name '${componentData.name}' already exists`);
    }

    // Create or get tags
    const tags = await this.tagService.findOrCreateTags(tagNames);

    // Create the component
    const component = this.uiComponentRepository.create({
      ...componentData,
      tags,
    });

    return this.uiComponentRepository.save(component);
  }

  async update(updateUIComponentInput: UpdateUIComponentInput): Promise<UIComponent> {
    const { id, tagNames, ...updateData } = updateUIComponentInput;

    const component = await this.findOne(id);

    // Check if component name already exists (excluding current component)
    if (updateData.name && updateData.name !== component.name) {
      const existingComponent = await this.uiComponentRepository.findOne({
        where: { name: updateData.name },
      });

      if (existingComponent) {
        throw new ConflictException(`Component with name '${updateData.name}' already exists`);
      }
    }

    // Update tags if provided
    if (tagNames !== undefined) {
      const tags = await this.tagService.findOrCreateTags(tagNames);
      component.tags = tags;
    }

    // Update component data
    Object.assign(component, updateData);

    return this.uiComponentRepository.save(component);
  }

  async remove(id: string): Promise<boolean> {
    const component = await this.findOne(id);
    await this.uiComponentRepository.remove(component);
    return true;
  }

  async getCategories(): Promise<ComponentCategory[]> {
    return Object.values(ComponentCategory);
  }

  async getStatuses(): Promise<ComponentStatus[]> {
    return Object.values(ComponentStatus);
  }

  async getComponentStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    deprecated: number;
    byCategory: { category: ComponentCategory; count: number }[];
  }> {
    const total = await this.uiComponentRepository.count();
    const active = await this.uiComponentRepository.count({ where: { status: ComponentStatus.ACTIVE } });
    const inactive = await this.uiComponentRepository.count({ where: { status: ComponentStatus.INACTIVE } });
    const deprecated = await this.uiComponentRepository.count({ where: { status: ComponentStatus.DEPRECATED } });

    const byCategory = await Promise.all(
      Object.values(ComponentCategory).map(async (category) => ({
        category,
        count: await this.uiComponentRepository.count({ where: { category } }),
      }))
    );

    return {
      total,
      active,
      inactive,
      deprecated,
      byCategory,
    };
  }
}