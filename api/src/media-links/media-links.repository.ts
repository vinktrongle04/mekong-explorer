import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaStatus } from '@prisma/client';

@Injectable()
export class MediaLinksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    placeId: string;
    submittedById: string | null;
    url: string;
    embedUrl: string;
    platform: 'TIKTOK' | 'FACEBOOK' | 'YOUTUBE';
  }) {
    return this.prisma.placeMediaLink.create({ data: { ...data, status: MediaStatus.PENDING } });
  }

  async findApprovedByPlace(placeId: string) {
    return this.prisma.placeMediaLink.findMany({
      where: { placeId, status: MediaStatus.APPROVED },
      orderBy: [{ likeCount: 'desc' }, { createdAt: 'desc' }],
      take: 20,
    });
  }

  async findPendingAll() {
    return this.prisma.placeMediaLink.findMany({
      where: { status: MediaStatus.PENDING },
      orderBy: { createdAt: 'asc' },
      include: { place: { select: { name: true } }, submittedBy: { select: { email: true } } },
    });
  }

  async findById(id: string) {
    return this.prisma.placeMediaLink.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: MediaStatus) {
    return this.prisma.placeMediaLink.update({ where: { id }, data: { status } });
  }

  async incrementLike(id: string) {
    return this.prisma.placeMediaLink.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    });
  }

  async findByPlaceAndUrl(placeId: string, url: string) {
    return this.prisma.placeMediaLink.findUnique({
      where: { unique_place_media_url: { placeId, url } },
    });
  }
}
