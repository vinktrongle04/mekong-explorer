import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ReviewsRepository } from './repositories/reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  async create(createReviewDto: CreateReviewDto) {
    // The repository handles the transaction to both create the review AND update the Place's averageRating
    return this.reviewsRepository.create(createReviewDto);
  }

  async findByPlace(placeId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.reviewsRepository.findByPlace(placeId, skip, limit);
  }

  async findOne(id: string) {
    const review = await this.reviewsRepository.findOne(id);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string) {
    const review = await this.findOne(id);
    
    // Ensure the user updating the review is the author
    if (review.userId !== userId) {
      throw new UnauthorizedException('You can only edit your own reviews');
    }

    return this.reviewsRepository.update(id, updateReviewDto);
  }

  async remove(id: string, userId: string, role: string) {
    const review = await this.findOne(id);
    
    // Ensure the user is the author OR an Admin/Moderator
    if (review.userId !== userId && role !== 'ADMIN' && role !== 'MODERATOR') {
      throw new UnauthorizedException('You do not have permission to delete this review');
    }

    return this.reviewsRepository.remove(id, review.placeId);
  }
}
