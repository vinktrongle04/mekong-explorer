import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/places')
@UseInterceptors(CacheInterceptor)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPlaceDto: CreatePlaceDto, @Request() req: any) {
    // Append the creator's user ID from JWT context
    return this.placesService.create(createPlaceDto, req.user.sub);
  }

  @Get()
  async findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '20') {
    return this.placesService.findAll(+page, +limit);
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.placesService.search(q);
  }

  @Get('nearby')
  async getNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string = '5000'
  ) {
    return this.placesService.findNearby(+lat, +lng, +radius);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.placesService.remove(id);
  }
}
