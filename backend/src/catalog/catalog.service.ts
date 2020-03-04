import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogItem } from './catalog.entity';
import { CreateCatalogDto } from './dto/create-catalog.dto';

@Injectable()
@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(CatalogItem)
    private readonly repo: Repository<CatalogItem>,
  ) {}

  create(dto: CreateCatalogDto) {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  findAll(limit?: number, offset?: number) {
    const query = this.repo.createQueryBuilder('item');

    if (limit !== undefined) query.take(Number(limit));
    if (offset !== undefined) query.skip(Number(offset));

    return query.getMany();
  }

  async findOne(id: string): Promise<CatalogItem> {
    const catalog = await this.repo.findOne({ where: { id } });

    if (!catalog) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }

    return catalog;
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }
  }
}
