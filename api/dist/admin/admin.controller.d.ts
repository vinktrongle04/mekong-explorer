import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getSubmissions(): Promise<({
        place: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string;
            categoryId: string;
            latitude: number;
            longitude: number;
            address: string | null;
            province: string;
            averageRating: number;
            reviewCount: number;
            checkinCount: number;
            status: import(".prisma/client").$Enums.PlaceStatus;
            createdById: string | null;
        };
        submitter: {
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                username: string;
                displayName: string | null;
                avatarUrl: string | null;
                bio: string | null;
                userId: string;
            } | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ContentStatus;
        placeId: string;
        submittedById: string;
        proposedChanges: import("@prisma/client/runtime/library").JsonValue;
        reviewedById: string | null;
        reviewedAt: Date | null;
    })[]>;
    approvePlace(submissionId: string): Promise<{
        message: string;
        placeId: string;
    }>;
    rejectPlace(rejectDto: {
        submissionId: string;
        reason: string;
    }): Promise<{
        message: string;
    }>;
}
