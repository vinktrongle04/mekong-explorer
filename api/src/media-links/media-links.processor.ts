import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MediaLinksService } from './media-links.service';
import { MediaLinksRepository } from './media-links.repository';
import { MediaStatus } from '@prisma/client';

@Processor('media-links')
export class MediaLinksProcessor extends WorkerHost {
  constructor(
    private readonly mediaLinksService: MediaLinksService,
    private readonly repo: MediaLinksRepository,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { id, url } = job.data;
    
    try {
      // 1. Detect platform and generate embed URL
      const platform = this.mediaLinksService.detectPlatform(url);
      const embedUrl = this.mediaLinksService.generateEmbedUrl(url, platform);

      // 2. Update the record in DB
      await this.repo.updateProcessed(id, {
        embedUrl,
        platform,
        status: MediaStatus.PENDING, // Still needs admin approval, but URL is processed
      });

      console.log(`Successfully processed media link: ${id}`);
    } catch (error) {
      console.error(`Failed to process media link ${id}:`, error.message);
      await this.repo.updateStatus(id, MediaStatus.REJECTED);
    }
  }
}
