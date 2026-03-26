import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MediaLinksService } from './media-links.service';
import { MediaLinksRepository } from './media-links.repository';
export declare class MediaLinksProcessor extends WorkerHost {
    private readonly mediaLinksService;
    private readonly repo;
    constructor(mediaLinksService: MediaLinksService, repo: MediaLinksRepository);
    process(job: Job<any, any, string>): Promise<any>;
}
