import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @Request() req: any) {
    // Override the userId in the DTO with the securely authenticated User ID from the JWT
    createReviewDto.userId = req.user.sub;
    return this.reviewsService.create(createReviewDto);
  }

  @Get('place/:placeId')
  async findByPlace(
    @Param('placeId') placeId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.reviewsService.findByPlace(placeId, +page, +limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req: any
  ) {
    return this.reviewsService.update(id, updateReviewDto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.reviewsService.remove(id, req.user.sub, req.user.role);
  }
}
