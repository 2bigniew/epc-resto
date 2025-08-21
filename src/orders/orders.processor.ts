import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ORDERS_QUEUE_KEY } from '@orders/orders.consts';

@Processor(ORDERS_QUEUE_KEY)
export class OrdersProcessor extends WorkerHost {
  // @OnWorkerEvent('active')
  // onActiveHandler() {
  //   console.log(`Processing job`);
  // }

  async process(job: unknown, token?: string) {
    console.log(job, token);
  }
}
