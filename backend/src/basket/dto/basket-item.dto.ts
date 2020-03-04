// src/basket/dto/basket-item.dto.ts
import { IsString, IsNumber, Min } from 'class-validator';

export class BasketItemDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}
