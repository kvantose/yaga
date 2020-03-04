// catalog.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  Delete,
  Param,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CatalogService } from './catalog.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { existsSync, unlinkSync } from 'fs';

@Controller('api')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('catalog')
  findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.catalogService.findAll(limit, offset);
  }

  @Post('catalog')
  create(@Body() dto: CreateCatalogDto) {
    return this.catalogService.create(dto);
  }

  @Delete('delete-catalog/:id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      // Получаем товар для получения пути к файлу
      const catalogItem = await this.catalogService.findOne(id);

      if (!catalogItem) {
        throw new NotFoundException(`Товар с ID ${id} не найден`);
      }

      // Удаляем файл изображения если он есть
      await this.deleteImageFile(catalogItem.image);

      // Удаляем товар из базы
      await this.catalogService.remove(id);

      return { message: 'Товар успешно удален' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Ошибка при удалении товара:', error);
      throw new InternalServerErrorException('Не удалось удалить товар');
    }
  }

  private async deleteImageFile(imagePath: string | null): Promise<void> {
    if (!imagePath) {
      return;
    }

    try {
      // Извлекаем имя файла из URL (например, "/uploads/filename.jpg" -> "filename.jpg")
      const filename = imagePath.split('/').pop();

      if (!filename) {
        return;
      }

      const fullPath = join(process.cwd(), 'uploads', filename);

      if (existsSync(fullPath)) {
        unlinkSync(fullPath);
        console.log(`Файл ${filename} успешно удален`);
      }
    } catch (fileError: unknown) {
      const errorMessage =
        fileError instanceof Error ? fileError.message : 'Неизвестная ошибка';
      console.warn(`Не удалось удалить файл: ${imagePath}`, errorMessage);
      // Не прерываем выполнение, если не удалось удалить файл
    }
  }

  // ✅ Endpoint для загрузки изображений
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (
        req: Express.Request,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedMimes.includes(file.mimetype)) {
          // Создаем ошибку с явным указанием типа
          const error: Error = new Error(
            'Разрешены только файлы JPG, PNG и WebP',
          );
          callback(error, false);
          return;
        }

        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadFile(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        'Неверный формат файла или превышен лимит размера',
      );
    }

    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
