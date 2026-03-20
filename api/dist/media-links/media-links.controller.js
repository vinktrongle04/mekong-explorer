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
exports.MediaLinksController = void 0;
const common_1 = require("@nestjs/common");
const media_links_service_1 = require("./media-links.service");
const create_media_link_dto_1 = require("./dto/create-media-link.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let MediaLinksController = class MediaLinksController {
    mediaLinksService;
    constructor(mediaLinksService) {
        this.mediaLinksService = mediaLinksService;
    }
    async submit(dto, req) {
        dto.userId = req.user.sub;
        return this.mediaLinksService.submit(dto);
    }
    async getByPlace(id) {
        return this.mediaLinksService.getApprovedForPlace(id);
    }
    async like(id) {
        return this.mediaLinksService.like(id);
    }
    async getPending() {
        return this.mediaLinksService.getPendingAll();
    }
    async approve(id) {
        return this.mediaLinksService.approve(id);
    }
    async reject(id) {
        return this.mediaLinksService.reject(id);
    }
};
exports.MediaLinksController = MediaLinksController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('media-links'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_media_link_dto_1.CreateMediaLinkDto, Object]),
    __metadata("design:returntype", Promise)
], MediaLinksController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)('places/:id/media-links'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaLinksController.prototype, "getByPlace", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('media-links/:id/like'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaLinksController.prototype, "like", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/media-links/pending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaLinksController.prototype, "getPending", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('admin/media-links/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaLinksController.prototype, "approve", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('admin/media-links/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaLinksController.prototype, "reject", null);
exports.MediaLinksController = MediaLinksController = __decorate([
    (0, common_1.Controller)('api/v1'),
    __metadata("design:paramtypes", [media_links_service_1.MediaLinksService])
], MediaLinksController);
//# sourceMappingURL=media-links.controller.js.map