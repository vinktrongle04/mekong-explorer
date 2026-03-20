import { MediaLinksRepository } from './media-links.repository';
import { CreateMediaLinkDto } from './dto/create-media-link.dto';
type Platform = 'TIKTOK' | 'FACEBOOK' | 'YOUTUBE';
export declare class MediaLinksService {
    private readonly repo;
    constructor(repo: MediaLinksRepository);
    private detectPlatform;
    generateEmbedUrl(url: string, platform: Platform): string;
    submit(dto: CreateMediaLinkDto): Promise<{
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
    getApprovedForPlace(placeId: string): Promise<{
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
    like(id: string): Promise<{
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
    approve(id: string): Promise<{
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
    reject(id: string): Promise<{
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
        embedUrl: string;
        platform: import(".prisma/client").$Enums.MediaPlatform;
        likeCount: number;
    })[]>;
}
export {};
