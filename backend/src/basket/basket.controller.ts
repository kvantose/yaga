import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { CreateOrderDto } from './dto/create-basket.dto';
import { GetOrdersQuery } from './dto/get-orders.query';

@Controller('api/orders')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.basketService.createOrder(dto);
  }

  @Get()
  getAll(@Query() query: GetOrdersQuery) {
    return this.basketService.getAll(query.limit, query.offset);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const order = await this.basketService.getById(id);
    if (!order) throw new NotFoundException('Заказ не найден');
    return order;
  }
}
