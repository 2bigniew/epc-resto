import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { ORDERS_QUEUE_KEY } from '@orders/orders.consts';
import { OrdersProcessor } from '@orders/orders.processor';
import {
  ORDER_MODEL_NAME,
  OrderEntitySchema,
} from '@shared/schemas/order.schema';
import { OrderRepository } from '@orders/order.repository';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderQueueController } from '@orders/order.queue.controller';
import { MEALS_QUEUE_KEY } from '@meals/meals.const.dto';

@Module({
  imports: [
    BullModule.registerQueue({
      name: ORDERS_QUEUE_KEY,
      defaultJobOptions: {
        priority: 1,
        attempts: 3,
        removeOnComplete: false,
        removeOnFail: false,
      },
    }),
    BullModule.registerQueue({
      name: MEALS_QUEUE_KEY,
      defaultJobOptions: {
        priority: 1,
        attempts: 3,
        removeOnComplete: false,
        removeOnFail: false,
      },
    }),
    MongooseModule.forFeature([
      { name: ORDER_MODEL_NAME, schema: OrderEntitySchema },
    ]),
  ],
  controllers: [OrdersController, OrderQueueController],
  providers: [OrdersService, OrdersProcessor, OrderRepository],
})
export class OrdersModule {}
