import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PhotosModule } from './photos/photos.module';
import { AdminModule } from './admin/admin.module';
import { MediaLinksModule } from './media-links/media-links.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PlacesModule,
    ReviewsModule,
    PhotosModule,
    AdminModule,
    MediaLinksModule,
  ],
})
export class AppModule {}

