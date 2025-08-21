import {
  QueueEventsHost,
  QueueEventsListener,
  OnQueueEvent,
} from '@nestjs/bullmq';
import { ORDERS_QUEUE_KEY } from '@orders/orders.consts';

@QueueEventsListener(ORDERS_QUEUE_KEY)
export class OrdersEventListener extends QueueEventsHost {
  @OnQueueEvent('active')
  onActive(job: { jobId: string; prev?: string }) {
    console.log(`Processing job ${job.jobId}...`);
  }
}
