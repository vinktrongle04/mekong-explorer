import { MediaLinksService } from './media-links.service';
import { CreateMediaLinkDto } from './dto/create-media-link.dto';
export declare class MediaLinksController {
    private readonly mediaLinksService;
    constructor(mediaLinksService: MediaLinksService);
    submit(dto: CreateMediaLinkDto, req: any): Promise<{
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
    getByPlace(id: string): Promise<{
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
    getPending(): Promise<({
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
}
