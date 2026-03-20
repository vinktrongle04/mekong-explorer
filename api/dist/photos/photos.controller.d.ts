import { PhotosService } from './photos.service';
import { UploadPhotosDto } from './dto/upload-photos.dto';
export declare class PhotosController {
    private readonly photosService;
    constructor(photosService: PhotosService);
    upload(files: Array<Express.Multer.File>, uploadPhotosDto: UploadPhotosDto, req: any): Promise<{
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
