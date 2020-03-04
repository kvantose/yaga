import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FeedbackDto } from './dto/feedback.dto';

@Injectable()
export class TelegramService {
  private readonly apiUrl: string;

  constructor() {
    this.apiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;
  }

  async sendFeedback(dto: FeedbackDto): Promise<void> {
    const message = `
    📩 **Новое сообщение с сайта**

━━━━━━━━━━━━━━━

❓ **Вопрос:**
${dto.question}

📞 **Телефон:**
${dto.phone}

💬 **Telegram:**
${dto.telegram}
`;

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
      throw new InternalServerErrorException('Не удалось отправить сообщение');
    }
  }
}
