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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPendingSubmissions() {
        return this.prisma.placeSubmission.findMany({
            where: { status: client_1.ContentStatus.PENDING },
            include: { place: true, submitter: { select: { profile: true } } }
        });
    }
    async approvePlace(submissionId) {
        const submission = await this.prisma.placeSubmission.update({
            where: { id: submissionId },
            data: { status: client_1.ContentStatus.APPROVED, reviewedAt: new Date() },
        });
        await this.prisma.place.update({
            where: { id: submission.placeId },
            data: { status: client_1.PlaceStatus.APPROVED }
        });
        return { message: "Submission approved and Place is now active.", placeId: submission.placeId };
    }
    async rejectPlace(submissionId, reason) {
        await this.prisma.placeSubmission.update({
            where: { id: submissionId },
            data: { status: client_1.ContentStatus.HIDDEN, reviewedAt: new Date() }
        });
        return { message: "Submission rejected." };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map