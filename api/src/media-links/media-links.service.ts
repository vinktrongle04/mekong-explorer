import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { MediaLinksRepository } from './media-links.repository';
import { CreateMediaLinkDto } from './dto/create-media-link.dto';
import { MediaStatus } from '@prisma/client';

type Platform = 'TIKTOK' | 'FACEBOOK' | 'YOUTUBE';

@Injectable()
export class MediaLinksService {
  constructor(private readonly repo: MediaLinksRepository) {}

  /** Detect platform from URL */
  private detectPlatform(url: string): Platform {
    if (/tiktok\.com/i.test(url)) return 'TIKTOK';
    if (/facebook\.com/i.test(url)) return 'FACEBOOK';
    if (/youtube\.com|youtu\.be/i.test(url)) return 'YOUTUBE';
    throw new BadRequestException('URL must be from TikTok, Facebook, or YouTube');
  }

  /** Convert public URL to embeddable iframe URL */
  generateEmbedUrl(url: string, platform: Platform): string {
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
    const platform = this.detectPlatform(dto.url);
    const embedUrl = this.generateEmbedUrl(dto.url, platform);

    // Duplicate check
    const existing = await this.repo.findByPlaceAndUrl(dto.placeId, dto.url);
    if (existing) throw new ConflictException('This link has already been submitted for this place');

    return this.repo.create({
      placeId: dto.placeId,
      submittedById: dto.userId || null,
      url: dto.url,
      embedUrl,
      platform,
    });
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
