import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MediaLinksController } from './media-links.controller';
import { MediaLinksService } from './media-links.service';
import { MediaLinksRepository } from './media-links.repository';
import { MediaLinksProcessor } from './media-links.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BullModule.registerQueue({
      name: 'media-links',
    }),
  ],
  controllers: [MediaLinksController],
  providers: [MediaLinksService, MediaLinksRepository, MediaLinksProcessor],
  exports: [MediaLinksService],
})
export class MediaLinksModule {}

