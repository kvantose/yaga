import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { CatalogImage, CatalogItem } from './catalog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogItem, CatalogImage])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
