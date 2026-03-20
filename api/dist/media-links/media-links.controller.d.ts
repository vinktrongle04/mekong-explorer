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
        embedUrl: string;
        platform: import(".prisma/client").$Enums.MediaPlatform;
        likeCount: number;
    }>;
    getByPlace(id: string): Promise<{
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
        embedUrl: string;
        platform: import(".prisma/client").$Enums.MediaPlatform;
        likeCount: number;
    })[]>;
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
}
