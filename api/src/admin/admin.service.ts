import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentStatus, PlaceStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getPendingSubmissions() {
    return this.prisma.placeSubmission.findMany({
      where: { status: ContentStatus.PENDING },
      include: { place: true, submitter: { select: { profile: true } } }
    });
  }

  async approvePlace(submissionId: string) {
    const submission = await this.prisma.placeSubmission.update({
      where: { id: submissionId },
      data: { status: ContentStatus.APPROVED, reviewedAt: new Date() },
    });

    // Also update actual place status
    await this.prisma.place.update({
      where: { id: submission.placeId },
      data: { status: PlaceStatus.APPROVED }
    });

    return { message: "Submission approved and Place is now active.", placeId: submission.placeId };
  }

  async rejectPlace(submissionId: string, reason: string) {
    await this.prisma.placeSubmission.update({
      where: { id: submissionId },
      data: { status: ContentStatus.HIDDEN, reviewedAt: new Date() }
    });
    return { message: "Submission rejected." };
  }
}
