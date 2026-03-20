import { PrismaService } from '../prisma/prisma.service';
import { MediaStatus } from '@prisma/client';
export declare class MediaLinksRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string;
        platform: 'TIKTOK' | 'FACEBOOK' | 'YOUTUBE';
    }): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string;
        platform: import(".prisma/client").$Enums.MediaPlatform;
        likeCount: number;
    }>;
    findApprovedByPlace(placeId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string;
        platform: import(".prisma/client").$Enums.MediaPlatform;
        likeCount: number;
    }[]>;
    findPendingAll(): Promise<({
        place: {
            name: string;
        };
        submittedBy: {
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string;
        platform: import(".prisma/client").$Enums.MediaPlatform;
        likeCount: number;
    })[]>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string;
        platform: import(".prisma/client").$Enums.MediaPlatform;
        likeCount: number;
    } | null>;
    updateStatus(id: string, status: MediaStatus): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string;
        platform: import(".prisma/client").$Enums.MediaPlatform;
        likeCount: number;
    }>;
    incrementLike(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string;
        platform: import(".prisma/client").$Enums.MediaPlatform;
        likeCount: number;
    }>;
    findByPlaceAndUrl(placeId: string, url: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string;
        platform: import(".prisma/client").$Enums.MediaPlatform;
        likeCount: number;
    } | null>;
}
