"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacesRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PlacesRepository = class PlacesRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, userId) {
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
    async findAll(skip, take) {
        return this.prisma.place.findMany({
            skip,
            take,
            where: { status: 'APPROVED' },
            orderBy: { createdAt: 'desc' },
            include: { category: true },
        });
    }
    async search(query) {
        return this.prisma.place.findMany({
            where: {
                name: { contains: query, mode: 'insensitive' },
                status: 'APPROVED',
            },
            take: 20,
        });
    }
    async findNearby(lat, lng, radiusInMeters) {
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
    async findOne(id) {
        return this.prisma.place.findUnique({
            where: { id },
            include: { category: true, photos: true, reviews: true },
        });
    }
    async update(id, data) {
        return this.prisma.place.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.place.delete({
            where: { id },
        });
    }
};
exports.PlacesRepository = PlacesRepository;
exports.PlacesRepository = PlacesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlacesRepository);
//# sourceMappingURL=places.repository.js.map