import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Param,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadPhotosDto } from './dto/upload-photos.dto';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB Limit per file

@Controller('api/v1/photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, { // Max 10 files at once
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (req, file, cb) => {
        // Only accept images
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|avif)$/)) {
          return cb(new BadRequestException('Only image files (JPG, PNG, WEBP, AVIF) are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async upload(
    // Express.Multer.File definitions are provided via @types/multer
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() uploadPhotosDto: UploadPhotosDto,
    @Request() req: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file must be uploaded');
    }
    
    // Pass user ID from JWT context
    return this.photosService.uploadMultiple(files, uploadPhotosDto, req.user.sub);
  }

  @Get('place/:placeId')
  async getPlacePhotos(@Param('placeId') placeId: string) {
    return this.photosService.getPlacePhotos(placeId);
  }
}
