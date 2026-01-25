// catalog.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseInterceptors,
  Delete,
  Param,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Patch,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CatalogService } from './catalog.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { existsSync, unlinkSync } from 'fs';
import { UpdateCatalogDto } from './dto/update-catalog.dto';

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
    const catalogItem = await this.catalogService.findOne(id);
    if (catalogItem.images && catalogItem.images.length > 0) {
      for (const img of catalogItem.images) {
        await this.deleteImageFile(img.url);
      }
    }
    await this.catalogService.remove(id);
    return { message: 'Товар успешно удален' };
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
  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
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
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Файлы не загружены');
    }

    // Возвращаем массив путей
    return files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    }));
  }

  @Patch('catalog/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateCatalogDto) {
    try {
      const oldItem = await this.catalogService.findOne(id);

      if (dto.images) {
        const oldUrls = oldItem.images.map((img) => img.url);
        const imagesToDelete = oldUrls.filter(
          (url) => dto.images && !dto.images.includes(url),
        );

        for (const url of imagesToDelete) {
          await this.deleteImageFile(url);
        }
      }

      return await this.catalogService.update(id, dto);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;
      console.error('Ошибка при обновлении товара:', error);
      throw new InternalServerErrorException('Не удалось обновить товар');
    }
  }
}
