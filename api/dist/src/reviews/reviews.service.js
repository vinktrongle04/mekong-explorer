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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const reviews_repository_1 = require("./repositories/reviews.repository");
let ReviewsService = class ReviewsService {
    reviewsRepository;
    constructor(reviewsRepository) {
        this.reviewsRepository = reviewsRepository;
    }
    async create(createReviewDto) {
        return this.reviewsRepository.create(createReviewDto);
    }
    async findByPlace(placeId, page, limit) {
        const skip = (page - 1) * limit;
        return this.reviewsRepository.findByPlace(placeId, skip, limit);
    }
    async findOne(id) {
        const review = await this.reviewsRepository.findOne(id);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        return review;
    }
    async update(id, updateReviewDto, userId) {
        const review = await this.findOne(id);
        if (review.userId !== userId) {
            throw new common_1.UnauthorizedException('You can only edit your own reviews');
        }
        return this.reviewsRepository.update(id, updateReviewDto);
    }
    async remove(id, userId, role) {
        const review = await this.findOne(id);
        if (review.userId !== userId && role !== 'ADMIN' && role !== 'MODERATOR') {
            throw new common_1.UnauthorizedException('You do not have permission to delete this review');
        }
        return this.reviewsRepository.remove(id, review.placeId);
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reviews_repository_1.ReviewsRepository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map