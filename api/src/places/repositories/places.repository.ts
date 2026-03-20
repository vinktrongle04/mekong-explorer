import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlaceDto } from '../dto/create-place.dto';
import { UpdatePlaceDto } from '../dto/update-place.dto';

@Injectable()
export class PlacesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePlaceDto, userId: string) {
    return this.prisma.place.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        latitude: data.latitude,
        longitude: data.longitude,
        province: data.province,
        address: data.address,
        createdById: userId,
      },
    });
  }

  async findAll(skip: number, take: number) {
    return this.prisma.place.findMany({
      skip,
      take,
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }

  async search(query: string) {
    return this.prisma.place.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
        status: 'APPROVED',
      },
      take: 20,
    });
  }

  async findNearby(lat: number, lng: number, radiusInMeters: number) {
    // Leveraging Prisma's $queryRaw to utilize PostGIS raw functions
    // Note: ensure lat and lng inputs are sanitized numeric types in the controller/service layer
    const places = await this.prisma.$queryRawUnsafe(`
      SELECT p.id, p.name, p.slug, p.description, p.address, p.province, 
             p.latitude, p.longitude, p."averageRating", p."reviewCount",
      ST_Distance(
        ST_MakePoint(p.longitude, p.latitude)::geography,
        ST_MakePoint($1, $2)::geography
      ) as distance_meters
      FROM places p
      WHERE p.status = 'APPROVED'
      AND ST_DWithin(
        ST_MakePoint(p.longitude, p.latitude)::geography,
        ST_MakePoint($1, $2)::geography,
        $3
      )
      ORDER BY distance_meters ASC
      LIMIT 50
    `, lng, lat, radiusInMeters);

    return places;
  }

  async findOne(id: string) {
    return this.prisma.place.findUnique({
      where: { id },
      include: { category: true, photos: true, reviews: true },
    });
  }

  async update(id: string, data: UpdatePlaceDto) {
    return this.prisma.place.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.place.delete({
      where: { id },
    });
  }
}
