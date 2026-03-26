import { ReviewsRepository } from './repositories/reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsService {
    private readonly reviewsRepository;
    constructor(reviewsRepository: ReviewsRepository);
    create(createReviewDto: CreateReviewDto): Promise<any>;
    findByPlace(placeId: string, page: number, limit: number): Promise<({
        user: {
            profile: {
                displayName: string | null;
                avatarUrl: string | null;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ContentStatus;
        placeId: string;
        userId: string;
        rating: number;
        content: string | null;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ContentStatus;
        placeId: string;
        userId: string;
        rating: number;
        content: string | null;
    }>;
    update(id: string, updateReviewDto: UpdateReviewDto, userId: string): Promise<any>;
    remove(id: string, userId: string, role: string): Promise<any>;
}
