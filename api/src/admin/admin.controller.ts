import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api/v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('submissions')
  async getSubmissions() {
    return this.adminService.getPendingSubmissions();
  }

  @Post('approve-place')
  async approvePlace(@Body('submissionId') submissionId: string) {
    return this.adminService.approvePlace(submissionId);
  }

  @Post('reject-place')
  async rejectPlace(@Body() rejectDto: { submissionId: string; reason: string }) {
    return this.adminService.rejectPlace(rejectDto.submissionId, rejectDto.reason);
  }
}
