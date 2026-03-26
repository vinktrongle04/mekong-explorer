import { Queue } from 'bullmq';
import { MediaLinksRepository } from './media-links.repository';
import { CreateMediaLinkDto } from './dto/create-media-link.dto';
export type Platform = 'TIKTOK' | 'FACEBOOK' | 'YOUTUBE';
export declare class MediaLinksService {
    private readonly repo;
    private readonly mediaQueue;
    constructor(repo: MediaLinksRepository, mediaQueue: Queue);
    detectPlatform(url: string): Platform;
    generateEmbedUrl(url: string, platform: Platform): string;
    submit(dto: CreateMediaLinkDto): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string | null;
        platform: import(".prisma/client").$Enums.MediaPlatform | null;
        likeCount: number;
    }>;
    getApprovedForPlace(placeId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string | null;
        platform: import(".prisma/client").$Enums.MediaPlatform | null;
        likeCount: number;
    }[]>;
    like(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string | null;
        platform: import(".prisma/client").$Enums.MediaPlatform | null;
        likeCount: number;
    }>;
    approve(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string | null;
        platform: import(".prisma/client").$Enums.MediaPlatform | null;
        likeCount: number;
    }>;
    reject(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.MediaStatus;
        placeId: string;
        submittedById: string | null;
        url: string;
        embedUrl: string | null;
        platform: import(".prisma/client").$Enums.MediaPlatform | null;
        likeCount: number;
    }>;
    getPendingAll(): Promise<({
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
        embedUrl: string | null;
        platform: import(".prisma/client").$Enums.MediaPlatform | null;
        likeCount: number;
    })[]>;
}
