import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
export declare class ReviewsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private updatePlaceRating;
    create(data: CreateReviewDto): Promise<any>;
    findByPlace(placeId: string, skip: number, take: number): Promise<({
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
    } | null>;
    update(id: string, data: UpdateReviewDto): Promise<any>;
    remove(id: string, placeId: string): Promise<any>;
}
