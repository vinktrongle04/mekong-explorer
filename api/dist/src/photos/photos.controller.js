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
exports.PhotosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const photos_service_1 = require("./photos.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const upload_photos_dto_1 = require("./dto/upload-photos.dto");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
let PhotosController = class PhotosController {
    photosService;
    constructor(photosService) {
        this.photosService = photosService;
    }
    async upload(files, uploadPhotosDto, req) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('At least one file must be uploaded');
        }
        return this.photosService.uploadMultiple(files, uploadPhotosDto, req.user.sub);
    }
    async getPlacePhotos(placeId) {
        return this.photosService.getPlacePhotos(placeId);
    }
};
exports.PhotosController = PhotosController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        limits: { fileSize: MAX_FILE_SIZE },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|avif)$/)) {
                return cb(new common_1.BadRequestException('Only image files (JPG, PNG, WEBP, AVIF) are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array,
        upload_photos_dto_1.UploadPhotosDto, Object]),
    __metadata("design:returntype", Promise)
], PhotosController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)('place/:placeId'),
    __param(0, (0, common_1.Param)('placeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PhotosController.prototype, "getPlacePhotos", null);
exports.PhotosController = PhotosController = __decorate([
    (0, common_1.Controller)('api/v1/photos'),
    __metadata("design:paramtypes", [photos_service_1.PhotosService])
], PhotosController);
//# sourceMappingURL=photos.controller.js.map