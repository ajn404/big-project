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
}