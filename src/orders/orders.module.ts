import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ORDERS_FLOW_PRODUCER, ORDERS_QUEUE_KEY } from '@orders/orders.consts';
import { OrdersEventListener } from '@orders/orders.event-listener';
import { OrdersProcessor } from '@orders/orders.processor';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      // configKey: ORDERS_QUEUE_CONFIG_KEY,
      name: ORDERS_QUEUE_KEY,
    }),
    BullModule.registerFlowProducer({
      name: ORDERS_FLOW_PRODUCER,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersEventListener, OrdersProcessor],
})
export class OrdersModule {}
