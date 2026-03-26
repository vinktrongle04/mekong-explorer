import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(createReviewDto: CreateReviewDto, req: any): Promise<any>;
    findByPlace(placeId: string, page?: string, limit?: string): Promise<({
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
    update(id: string, updateReviewDto: UpdateReviewDto, req: any): Promise<any>;
    remove(id: string, req: any): Promise<any>;
}
