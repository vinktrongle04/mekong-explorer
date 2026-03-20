import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { MediaLinksService } from './media-links.service';
import { CreateMediaLinkDto } from './dto/create-media-link.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1')
export class MediaLinksController {
  constructor(private readonly mediaLinksService: MediaLinksService) {}

  /** Submit a new media link (requires auth) */
  @UseGuards(JwtAuthGuard)
  @Post('media-links')
  async submit(@Body() dto: CreateMediaLinkDto, @Request() req: any) {
    dto.userId = req.user.sub;
    return this.mediaLinksService.submit(dto);
  }

  /** Get all approved media links for a place (public) */
  @Get('places/:id/media-links')
  async getByPlace(@Param('id') id: string) {
    return this.mediaLinksService.getApprovedForPlace(id);
  }

  /** Like a media link (requires auth) */
  @UseGuards(JwtAuthGuard)
  @Post('media-links/:id/like')
  async like(@Param('id') id: string) {
    return this.mediaLinksService.like(id);
  }

  /** Admin: get pending queue */
  @UseGuards(JwtAuthGuard)
  @Get('admin/media-links/pending')
  async getPending() {
    return this.mediaLinksService.getPendingAll();
  }

  /** Admin: approve a link */
  @UseGuards(JwtAuthGuard)
  @Post('admin/media-links/:id/approve')
  async approve(@Param('id') id: string) {
    return this.mediaLinksService.approve(id);
  }

  /** Admin: reject a link */
  @UseGuards(JwtAuthGuard)
  @Post('admin/media-links/:id/reject')
  async reject(@Param('id') id: string) {
    return this.mediaLinksService.reject(id);
  }
}
