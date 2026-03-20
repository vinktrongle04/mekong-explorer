import { IsUUID, IsOptional } from 'class-validator';

export class UploadPhotosDto {
  @IsUUID()
  placeId: string;

  @IsOptional()
  @IsUUID()
  reviewId?: string;
}
