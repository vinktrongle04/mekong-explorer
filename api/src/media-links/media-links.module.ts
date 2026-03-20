import { Module } from '@nestjs/common';
import { MediaLinksController } from './media-links.controller';
import { MediaLinksService } from './media-links.service';
import { MediaLinksRepository } from './media-links.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MediaLinksController],
  providers: [MediaLinksService, MediaLinksRepository],
  exports: [MediaLinksService],
})
export class MediaLinksModule {}
