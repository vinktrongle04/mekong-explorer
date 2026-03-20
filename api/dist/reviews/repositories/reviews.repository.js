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
exports.ReviewsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReviewsRepository = class ReviewsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updatePlaceRating(tx, placeId) {
        const aggregate = await tx.review.aggregate({
            where: { placeId, status: 'APPROVED' },
            _avg: { rating: true },
            _count: { id: true },
        });
        const averageRating = aggregate._avg.rating || 0;
        const reviewCount = aggregate._count.id;
        await tx.place.update({
            where: { id: placeId },
            data: {
                averageRating,
                reviewCount,
            },
        });
    }
    async create(data) {
        return this.prisma.$transaction(async (tx) => {
            const review = await tx.review.create({
                data: {
                    placeId: data.placeId,
                    userId: data.userId,
                    rating: data.rating,
                    content: data.content,
                },
            });
            await this.updatePlaceRating(tx, data.placeId);
            return review;
        });
    }
    async findByPlace(placeId, skip, take) {
        return this.prisma.review.findMany({
            where: { placeId, status: 'APPROVED' },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { profile: { select: { displayName: true, avatarUrl: true } } } },
            },
        });
    }
    async findOne(id) {
        return this.prisma.review.findUnique({
            where: { id },
        });
    }
    async update(id, data) {
        return this.prisma.$transaction(async (tx) => {
            const review = await tx.review.update({
                where: { id },
                data: {
                    rating: data.rating,
                    content: data.content,
                },
            });
            if (data.rating) {
                await this.updatePlaceRating(tx, review.placeId);
            }
            return review;
        });
    }
    async remove(id, placeId) {
        return this.prisma.$transaction(async (tx) => {
            const deletedReview = await tx.review.delete({
                where: { id },
            });
            await this.updatePlaceRating(tx, placeId);
            return deletedReview;
        });
    }
};
exports.ReviewsRepository = ReviewsRepository;
exports.ReviewsRepository = ReviewsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsRepository);
//# sourceMappingURL=reviews.repository.js.map