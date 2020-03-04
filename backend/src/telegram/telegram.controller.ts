import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { FeedbackDto } from './dto/feedback.dto';

@Controller('api')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('feedback')
  @HttpCode(HttpStatus.OK)
  async sendFeedback(@Body() dto: FeedbackDto) {
    await this.telegramService.sendFeedback(dto);
    return { success: true };
  }
}
