import { Injectable, BadRequestException, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MediaLinksRepository } from './media-links.repository';
import { CreateMediaLinkDto } from './dto/create-media-link.dto';
import { MediaStatus } from '@prisma/client';

export type Platform = 'TIKTOK' | 'FACEBOOK' | 'YOUTUBE';

@Injectable()
export class MediaLinksService {
  constructor(
    private readonly repo: MediaLinksRepository,
    @InjectQueue('media-links') private readonly mediaQueue: Queue,
  ) {}

  /** Detect platform from URL */
  public detectPlatform(url: string): Platform {
    if (/tiktok\.com/i.test(url)) return 'TIKTOK';
    if (/facebook\.com/i.test(url)) return 'FACEBOOK';
    if (/youtube\.com|youtu\.be/i.test(url)) return 'YOUTUBE';
    throw new BadRequestException('URL must be from TikTok, Facebook, or YouTube');
  }

  /** Convert public URL to embeddable iframe URL */
  public generateEmbedUrl(url: string, platform: Platform): string {
    switch (platform) {
      case 'YOUTUBE': {
        // Handle both youtube.com/watch?v=ID and youtu.be/ID
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/i);
        if (!match) throw new BadRequestException('Invalid YouTube URL format');
        return `https://www.youtube.com/embed/${match[1]}`;
      }
      case 'TIKTOK': {
        // Extract video ID from tiktok.com/@user/video/ID
        const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/i);
        if (!match) throw new BadRequestException('Invalid TikTok URL format. Use the full share URL.');
        return `https://www.tiktok.com/embed/v2/${match[1]}`;
      }
      case 'FACEBOOK': {
        // Use Facebook video embed syntax
        const encoded = encodeURIComponent(url);
        return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&width=560&appId`;
      }
    }
  }

  async submit(dto: CreateMediaLinkDto) {
    // 1. Synchronous check for duplicates
    const existing = await this.repo.findByPlaceAndUrl(dto.placeId, dto.url);
    if (existing) throw new ConflictException('This link has already been submitted for this place');

    // 2. Create the record in the DB (initially without platform/embedUrl)
    const record = await this.repo.create({
      placeId: dto.placeId,
      submittedById: dto.userId || null,
      url: dto.url,
    });

    // 3. Add to processing queue
    await this.mediaQueue.add('process-media', {
      id: record.id,
      url: dto.url,
    });

    return record;
  }

  async getApprovedForPlace(placeId: string) {
    return this.repo.findApprovedByPlace(placeId);
  }

  async like(id: string) {
    const link = await this.repo.findById(id);
    if (!link || link.status !== MediaStatus.APPROVED) throw new NotFoundException('Media link not found');
    return this.repo.incrementLike(id);
  }

  async approve(id: string) {
    const link = await this.repo.findById(id);
    if (!link) throw new NotFoundException('Media link not found');
    return this.repo.updateStatus(id, MediaStatus.APPROVED);
  }

  async reject(id: string) {
    const link = await this.repo.findById(id);
    if (!link) throw new NotFoundException('Media link not found');
    return this.repo.updateStatus(id, MediaStatus.REJECTED);
  }

  async getPendingAll() {
    return this.repo.findPendingAll();
  }
}
