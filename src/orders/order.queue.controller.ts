import { Controller, Get, Query } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrdersService } from '@orders/orders.service';
import {
  OrderQueueReadRequestQueryDto,
  OrderQueueReadResponseDto,
} from '@orders/dtos/order-queue.read.dto';

/**
 * - Allow kitchen and waitstaff to check the queue and see what’s ready for them.
 *
 * I added this part of logic like that, because in this part of task it's highlighted to check the queue.
 * On the queue right now all kind of jobs are stored (no remove support)
 * In the way I designed this app, I would query mongodb to get list of task for
 * kitchen and waitstaff instead of querying queue. Currently it's possible to
 * get jobs from queue, however it's quite difficult to understand what is going on
 *
 * Apart from that, Authorization should be here with proper credentials -
 * separate for kitchen, and separate for waitstaff. Filters should be set
 * based on roles from credentials
 */

@Controller('order-queue')
export class OrderQueueController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/')
  async listJobs(
    @Query() query: OrderQueueReadRequestQueryDto,
  ): Promise<OrderQueueReadResponseDto<any>[]> {
    const { startIndex, endIndex, jobStatus } = query;
    const jobs = await this.ordersService.listJobsByStatus(
      jobStatus,
      startIndex,
      endIndex,
    );

    return jobs.map((job: Job) => ({
      id: job.id,
      name: job.name,
      data: job.data,
      attemptsMade: job.attemptsMade,
      processedOn: job.processedOn
        ? new Date(job.processedOn).toISOString()
        : undefined,
      finishedOn: job.finishedOn
        ? new Date(job.finishedOn).toISOString()
        : undefined,
      failedReason: job.failedReason,
      timestamp: job.timestamp,
    }));
  }
}
