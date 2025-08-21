import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ORDERS_QUEUE_KEY } from '@orders/orders.consts';

@Injectable()
export class OrdersService {
  constructor(@InjectQueue(ORDERS_QUEUE_KEY) private ordersQueue: Queue) {}
}
