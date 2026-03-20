import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Helper method to recalculate Place rating within transactions
  private async updatePlaceRating(tx: any, placeId: string) {
    const aggregate = await tx.review.aggregate({
      where: { placeId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: { id: true },
    });

    const averageRating = aggregate._avg.rating || 0;
    const reviewCount = aggregate._count.id;

    await tx.place.update({
      where: { id: placeId },
      data: {
        averageRating,
        reviewCount,
      },
    });
  }

  async create(data: CreateReviewDto) {
    return this.prisma.$transaction(async (tx: any) => {
      const review = await tx.review.create({
        data: {
          placeId: data.placeId,
          userId: data.userId!,
          rating: data.rating,
          content: data.content,
        },
      });

      // Recalculate average rating for the Place
      await this.updatePlaceRating(tx, data.placeId);

      return review;
    });
  }

  async findByPlace(placeId: string, skip: number, take: number) {
    return this.prisma.review.findMany({
      where: { placeId, status: 'APPROVED' },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { profile: { select: { displayName: true, avatarUrl: true } } } },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateReviewDto) {
    return this.prisma.$transaction(async (tx: any) => {
      const review = await tx.review.update({
        where: { id },
        data: {
          rating: data.rating,
          content: data.content,
        },
      });

      if (data.rating) {
        // If rating was modified, recalculate
        await this.updatePlaceRating(tx, review.placeId);
      }

      return review;
    });
  }

  async remove(id: string, placeId: string) {
    return this.prisma.$transaction(async (tx: any) => {
      const deletedReview = await tx.review.delete({
        where: { id },
      });

      // Recalculate rating without the deleted review
      await this.updatePlaceRating(tx, placeId);

      return deletedReview;
    });
  }
}
