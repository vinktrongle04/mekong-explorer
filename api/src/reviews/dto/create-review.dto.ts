import { IsString, IsNumber, IsOptional, MaxLength, Min, Max, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  placeId: string;

  // Note: userId is usually omitted from the DTO payload and extracted from the JWT token
  // but included here for completeness of input validation if passed.
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content?: string;
}
