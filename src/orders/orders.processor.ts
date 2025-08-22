import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ORDERS_QUEUE_KEY } from '@orders/orders.consts';
import {
  CompleteOrderJob,
  CreateOrderJob,
  DeliverOrderJob,
  EOrderJobNames,
  ProcessOrderJob,
  TOrderJobs,
} from '@shared/jobs/order.job';
import { EMealsJobsNames, TMealJobsMap } from '@shared/jobs/meals.job';
import { OrdersService } from '@orders/orders.service';
import { MEALS_QUEUE_KEY } from '@meals/meals.const.dto';

@Processor(ORDERS_QUEUE_KEY)
export class OrdersProcessor extends WorkerHost {
  private readonly logger = new Logger(OrdersProcessor.name, {
    timestamp: true,
  });
  public constructor(
    private readonly ordersService: OrdersService,
    @InjectQueue(MEALS_QUEUE_KEY)
    private readonly mealsQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<TOrderJobs, void, EOrderJobNames>): Promise<any> {
    this.logger.log(
      `New job has been started, jobName: ${job.name}, payload: ${JSON.stringify(job.data)}`,
    );

    switch (job.name) {
      case EOrderJobNames.CREATE_ORDER: {
        const jobPayload = job.data as CreateOrderJob;
        return this.handleCreateOrderJob(jobPayload);
      }
      case EOrderJobNames.PROCESS_ORDER: {
        const jobPayload = job.data as ProcessOrderJob;
        return this.handleProcessOrderJob(jobPayload);
      }
      case EOrderJobNames.DELIVER_ORDER: {
        const jobPayload = job.data as DeliverOrderJob;
        return this.handleDeliverOrderJob(jobPayload);
      }
      case EOrderJobNames.COMPLETE_ORDER: {
        const jobPayload = job.data as CompleteOrderJob;
        return this.handleCompleteOrderJob(jobPayload);
      }
      default: {
        console.log(`Job ${job.name} not found`);
      }
    }
  }

  private async handleCreateOrderJob(
    jobPayload: CreateOrderJob,
  ): Promise<void> {
    await this.ordersService.createOrder(jobPayload);

    const { orderId, orderedMealsNames } = jobPayload;

    const prepareMealJobPayload: TMealJobsMap[EMealsJobsNames.PREPARE_MEAL] = {
      orderId,
      orderedMealsNames,
    };

    await this.mealsQueue.add(
      EMealsJobsNames.PREPARE_MEAL,
      prepareMealJobPayload,
    );
  }

  private async handleProcessOrderJob(
    jobPayload: ProcessOrderJob,
  ): Promise<void> {
    await this.ordersService.markOrderAsInTheKitchen(jobPayload.orderId);
  }

  private async handleDeliverOrderJob(
    jobPayload: DeliverOrderJob,
  ): Promise<void> {
    await this.ordersService.updateOrderInDeliveryDetails(jobPayload);

    const serveMealJobPayload: TMealJobsMap[EMealsJobsNames.SERVE_MEAL] = {
      orderId: jobPayload.orderId,
    };

    await this.mealsQueue.add(EMealsJobsNames.SERVE_MEAL, serveMealJobPayload);
  }

  private async handleCompleteOrderJob(
    jobPayload: CompleteOrderJob,
  ): Promise<void> {
    await this.ordersService.markOrderAsDone(jobPayload.orderId);
  }
}
