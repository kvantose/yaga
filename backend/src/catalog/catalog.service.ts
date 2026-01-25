// catalog.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogItem, CatalogImage } from './catalog.entity';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(CatalogItem)
    private readonly repo: Repository<CatalogItem>,
    @InjectRepository(CatalogImage)
    private readonly imageRepo: Repository<CatalogImage>,
  ) {}

  async create(dto: CreateCatalogDto) {
    const { images, ...rest } = dto;
    const item = this.repo.create({
      ...rest,
      images: images?.map((url) => this.imageRepo.create({ url })),
    });
    return this.repo.save(item);
  }

  findAll(limit?: number, offset?: number) {
    return this.repo.find({
      take: limit,
      skip: offset,
      relations: ['images'],
    });
  }

  async findOne(id: string): Promise<CatalogItem> {
    const catalog = await this.repo.findOne({
      where: { id },
      relations: ['images'],
    });

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

  async update(id: string, dto: UpdateCatalogDto): Promise<CatalogItem> {
    const item = await this.findOne(id);
    const { images, ...rest } = dto;

    if (images) {
      await this.imageRepo.delete({ catalogItem: { id } });
      item.images = images.map((url) => this.imageRepo.create({ url }));
    }

    Object.assign(item, rest);
    return this.repo.save(item);
  }
}
