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
exports.MediaLinksProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const media_links_service_1 = require("./media-links.service");
const media_links_repository_1 = require("./media-links.repository");
const client_1 = require("@prisma/client");
let MediaLinksProcessor = class MediaLinksProcessor extends bullmq_1.WorkerHost {
    mediaLinksService;
    repo;
    constructor(mediaLinksService, repo) {
        super();
        this.mediaLinksService = mediaLinksService;
        this.repo = repo;
    }
    async process(job) {
        const { id, url } = job.data;
        try {
            const platform = this.mediaLinksService.detectPlatform(url);
            const embedUrl = this.mediaLinksService.generateEmbedUrl(url, platform);
            await this.repo.updateProcessed(id, {
                embedUrl,
                platform,
                status: client_1.MediaStatus.PENDING,
            });
            console.log(`Successfully processed media link: ${id}`);
        }
        catch (error) {
            console.error(`Failed to process media link ${id}:`, error.message);
            await this.repo.updateStatus(id, client_1.MediaStatus.REJECTED);
        }
    }
};
exports.MediaLinksProcessor = MediaLinksProcessor;
exports.MediaLinksProcessor = MediaLinksProcessor = __decorate([
    (0, bullmq_1.Processor)('media-links'),
    __metadata("design:paramtypes", [media_links_service_1.MediaLinksService,
        media_links_repository_1.MediaLinksRepository])
], MediaLinksProcessor);
//# sourceMappingURL=media-links.processor.js.map