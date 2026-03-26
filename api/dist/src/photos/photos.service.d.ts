import { PrismaService } from '../prisma/prisma.service';
import { UploadPhotosDto } from './dto/upload-photos.dto';
export declare class PhotosService {
    private readonly prisma;
    private s3Client;
    private bucketName;
    private region;
    constructor(prisma: PrismaService);
    uploadMultiple(files: Array<Express.Multer.File>, uploadDto: UploadPhotosDto, userId: string): Promise<{
        message: string;
        photoCount: number;
        photos: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.ContentStatus;
            placeId: string;
            uploaderId: string | null;
            reviewId: string | null;
            rawUrl: string;
            webpUrl: string;
            thumbnailUrl: string;
        }[];
    }>;
    getPlacePhotos(placeId: string): Promise<({
        uploader: {
            profile: {
                displayName: string | null;
                avatarUrl: string | null;
            } | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ContentStatus;
        placeId: string;
        uploaderId: string | null;
        reviewId: string | null;
        rawUrl: string;
        webpUrl: string;
        thumbnailUrl: string;
    })[]>;
}
