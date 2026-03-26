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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaLinksService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const media_links_repository_1 = require("./media-links.repository");
const client_1 = require("@prisma/client");
let MediaLinksService = class MediaLinksService {
    repo;
    mediaQueue;
    constructor(repo, mediaQueue) {
        this.repo = repo;
        this.mediaQueue = mediaQueue;
    }
    detectPlatform(url) {
        if (/tiktok\.com/i.test(url))
            return 'TIKTOK';
        if (/facebook\.com/i.test(url))
            return 'FACEBOOK';
        if (/youtube\.com|youtu\.be/i.test(url))
            return 'YOUTUBE';
        throw new common_1.BadRequestException('URL must be from TikTok, Facebook, or YouTube');
    }
    generateEmbedUrl(url, platform) {
        switch (platform) {
            case 'YOUTUBE': {
                const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/i);
                if (!match)
                    throw new common_1.BadRequestException('Invalid YouTube URL format');
                return `https://www.youtube.com/embed/${match[1]}`;
            }
            case 'TIKTOK': {
                const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/i);
                if (!match)
                    throw new common_1.BadRequestException('Invalid TikTok URL format. Use the full share URL.');
                return `https://www.tiktok.com/embed/v2/${match[1]}`;
            }
            case 'FACEBOOK': {
                const encoded = encodeURIComponent(url);
                return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&width=560&appId`;
            }
        }
    }
    async submit(dto) {
        const existing = await this.repo.findByPlaceAndUrl(dto.placeId, dto.url);
        if (existing)
            throw new common_1.ConflictException('This link has already been submitted for this place');
        const record = await this.repo.create({
            placeId: dto.placeId,
            submittedById: dto.userId || null,
            url: dto.url,
        });
        await this.mediaQueue.add('process-media', {
            id: record.id,
            url: dto.url,
        });
        return record;
    }
    async getApprovedForPlace(placeId) {
        return this.repo.findApprovedByPlace(placeId);
    }
    async like(id) {
        const link = await this.repo.findById(id);
        if (!link || link.status !== client_1.MediaStatus.APPROVED)
            throw new common_1.NotFoundException('Media link not found');
        return this.repo.incrementLike(id);
    }
    async approve(id) {
        const link = await this.repo.findById(id);
        if (!link)
            throw new common_1.NotFoundException('Media link not found');
        return this.repo.updateStatus(id, client_1.MediaStatus.APPROVED);
    }
    async reject(id) {
        const link = await this.repo.findById(id);
        if (!link)
            throw new common_1.NotFoundException('Media link not found');
        return this.repo.updateStatus(id, client_1.MediaStatus.REJECTED);
    }
    async getPendingAll() {
        return this.repo.findPendingAll();
    }
};
exports.MediaLinksService = MediaLinksService;
exports.MediaLinksService = MediaLinksService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)('media-links')),
    __metadata("design:paramtypes", [media_links_repository_1.MediaLinksRepository,
        bullmq_2.Queue])
], MediaLinksService);
//# sourceMappingURL=media-links.service.js.map