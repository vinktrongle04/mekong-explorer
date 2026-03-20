"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
let PhotosService = class PhotosService {
    prisma;
    s3Client;
    bucketName = process.env.AWS_S3_BUCKET || 'mekong-explorer-photos';
    region = process.env.AWS_REGION || 'ap-southeast-1';
    constructor(prisma) {
        this.prisma = prisma;
        this.s3Client = new client_s3_1.S3Client({
            region: this.region,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'stub_key',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'stub_secret',
            },
        });
    }
    async uploadMultiple(files, uploadDto, userId) {
        const uploadedPhotos = [];
        for (const file of files) {
            const ext = path.extname(file.originalname);
            const filename = `${(0, uuid_1.v4)()}${ext}`;
            const s3Key = `places/${uploadDto.placeId}/${filename}`;
            try {
                await this.s3Client.send(new client_s3_1.PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: s3Key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                }));
                const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${s3Key}`;
                const photoRecord = await this.prisma.photo.create({
                    data: {
                        placeId: uploadDto.placeId,
                        reviewId: uploadDto.reviewId,
                        uploaderId: userId,
                        rawUrl: fileUrl,
                        webpUrl: fileUrl,
                        thumbnailUrl: fileUrl,
                        status: 'APPROVED',
                    },
                });
                uploadedPhotos.push(photoRecord);
            }
            catch (error) {
                console.error('S3 Upload Error:', error);
                throw new common_1.InternalServerErrorException('Failed to upload images to AWS S3');
            }
        }
        return {
            message: 'Successfully uploaded photos',
            photoCount: uploadedPhotos.length,
            photos: uploadedPhotos,
        };
    }
    async getPlacePhotos(placeId) {
        return this.prisma.photo.findMany({
            where: { placeId, status: 'APPROVED' },
            orderBy: { createdAt: 'desc' },
            include: {
                uploader: { select: { profile: { select: { displayName: true, avatarUrl: true } } } },
            },
            take: 50,
        });
    }
};
exports.PhotosService = PhotosService;
exports.PhotosService = PhotosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PhotosService);
//# sourceMappingURL=photos.service.js.map