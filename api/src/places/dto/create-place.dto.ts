import { IsString, IsNumber, IsOptional, MaxLength, MinLength, IsUUID } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(255)
  slug: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsUUID()
  categoryId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  province: string;
}
