import { IsString, IsUrl, Matches } from 'class-validator';

const ALLOWED_DOMAINS = /^https:\/\/(www\.)?(tiktok\.com|facebook\.com|youtube\.com|youtu\.be)\/.+/i;

export class CreateMediaLinkDto {
  @IsString()
  placeId: string;

  @IsString()
  @IsUrl()
  @Matches(ALLOWED_DOMAINS, {
    message: 'URL must be from tiktok.com, facebook.com, or youtube.com',
  })
  url: string;

  // Injected from JWT — not from request body
  userId?: string;
}
