import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadPhotosDto } from './dto/upload-photos.dto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class PhotosService {
  private s3Client: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET || 'mekong-explorer-photos';
  private region = process.env.AWS_REGION || 'ap-southeast-1';

  constructor(private readonly prisma: PrismaService) {
    // Initialize the AWS S3 v3 SDK Client
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'stub_key',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'stub_secret',
      },
    });
  }

  async uploadMultiple(files: Array<Express.Multer.File>, uploadDto: UploadPhotosDto, userId: string) {
    const uploadedPhotos = [];

    for (const file of files) {
      const ext = path.extname(file.originalname);
      const filename = `${uuidv4()}${ext}`; // Ensure universally unique key names
      const s3Key = `places/${uploadDto.placeId}/${filename}`;

      try {
        // Upload file buffer to S3 directly
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: s3Key,
            Body: file.buffer,
            ContentType: file.mimetype,
            // Bucket dictates ownership; object ACLs are generally best avoided in modern S3 
          })
        );

        // Construct standard AWS S3 REST object URL
        const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${s3Key}`;

        // Save metadata to Prisma (PostgreSQL)
        const photoRecord = await this.prisma.photo.create({
          data: {
            placeId: uploadDto.placeId,
            reviewId: uploadDto.reviewId, // Associating with review if the user attached photos to a review
            uploaderId: userId,
            rawUrl: fileUrl,
            // In a production app, AWS Lambda or an SQS consumer would compress the rawUrl into WebP variants
            // and write back the URLs here. Stubbed with rawUrl for MVP.
            webpUrl: fileUrl, 
            thumbnailUrl: fileUrl,
            status: 'APPROVED', // Normally PENDING to flag for moderation
          },
        });

        uploadedPhotos.push(photoRecord);
      } catch (error) {
        console.error('S3 Upload Error:', error);
        throw new InternalServerErrorException('Failed to upload images to AWS S3');
      }
    }

    return {
      message: 'Successfully uploaded photos',
      photoCount: uploadedPhotos.length,
      photos: uploadedPhotos,
    };
  }

  async getPlacePhotos(placeId: string) {
    return this.prisma.photo.findMany({
      where: { placeId, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      include: {
        uploader: { select: { profile: { select: { displayName: true, avatarUrl: true } } } },
      },
      take: 50,
    });
  }
}
