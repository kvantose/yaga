// create-catalog.dto.ts
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { CatalogCategory } from '../catalog.entity';

export class CreateCatalogDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(CatalogCategory)
  category: CatalogCategory;

  @IsNumber()
  price: number;

  @IsString()
  image: string;
}