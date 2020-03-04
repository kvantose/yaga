import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderResponseDto } from './dto/order-response.dto';
import { CreateOrderDto } from './dto/create-basket.dto';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
  ) {}

  async createOrder(
    dto: CreateOrderDto,
  ): Promise<{ success: true; orderId: string }> {
    const totalPrice = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = this.orderRepo.create({
      phone: dto.phone,
      telegram: dto.telegram,
      totalPrice,
      items: dto.items.map((item) =>
        this.itemRepo.create({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }),
      ),
    });

    const savedOrder = await this.orderRepo.save(order);
    await this.sendTelegramNotification(savedOrder);

    return { success: true, orderId: savedOrder.id };
  }

  private async sendTelegramNotification(order: Order): Promise<void> {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.CHAT_ID;

    if (!token || !chatId) return;

    const itemsText = order.items
      .map(
        (item) =>
          `• *${item.name}* × ${item.quantity}\n  💰 ${
            item.price * item.quantity
          } ₽`,
      )
      .join('\n');

    const text = `
🛒 *Новый заказ*

━━━━━━━━━━━━━━━

📞 *Телефон:* ${order.phone}
💬 *Telegram:* ${order.telegram ?? '—'}

📦 *Состав заказа:*
${itemsText}

━━━━━━━━━━━━━━━

💳 *Итого:* *${order.totalPrice} ₽*
🆔 *Заказ ID:* \`${order.id}\`
🕒 *Дата:* ${new Date(order.createdAt).toLocaleString('ru-RU')}
`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    });
  }

  async getAll(limit = 200, offset = 0): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return orders.map((order) => this.toResponse(order));
  }

  async getById(id: string): Promise<OrderResponseDto | null> {
    const order = await this.orderRepo.findOne({
      where: { id },
    });

    return order ? this.toResponse(order) : null;
  }

  private toResponse(order: Order): OrderResponseDto {
    return {
      id: order.id,
      phone: order.phone,
      telegram: order.telegram,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };
  }
}
