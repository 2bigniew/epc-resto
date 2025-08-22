import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import {
  EMealsJobsNames,
  PrepareMealJob,
  TMealJob,
} from '@shared/jobs/meals.job';
import { ORDERS_QUEUE_KEY } from '@orders/orders.consts';
import {
  CompleteOrderJob,
  EOrderJobNames,
  TOrderJobsMap,
} from '@shared/jobs/order.job';
import { MealsService } from '@meals/meals.service';
import { MEALS_QUEUE_KEY } from '@meals/meals.const.dto';

@Processor(MEALS_QUEUE_KEY)
export class MealsProcessor extends WorkerHost {
  constructor(
    private readonly mealsService: MealsService,
    @InjectQueue(ORDERS_QUEUE_KEY)
    private readonly ordersQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<TMealJob, void, EMealsJobsNames>): Promise<any> {
    switch (job.name) {
      case EMealsJobsNames.PREPARE_MEAL: {
        const jobPayload = job.data as PrepareMealJob;
        return this.handlePrepareMealJob(jobPayload);
      }
      case EMealsJobsNames.SERVE_MEAL: {
        const jobPayload = job.data as CompleteOrderJob;
        return this.handleServeMealJob(jobPayload);
      }
      default: {
        console.log(`Job ${job.name} not found`);
      }
    }
  }

  private async handlePrepareMealJob(
    jobPayload: PrepareMealJob,
  ): Promise<void> {
    const { orderId, orderedMealsNames } = jobPayload;
    const processOrderJobPayload: TOrderJobsMap[EOrderJobNames.PROCESS_ORDER] =
      {
        orderId,
      };

    await this.ordersQueue.add(
      EOrderJobNames.PROCESS_ORDER,
      processOrderJobPayload,
    );

    const mealsDetails =
      await this.mealsService.getMealsDetailsByName(orderedMealsNames);

    const deliverOrderJobPayload: TOrderJobsMap[EOrderJobNames.DELIVER_ORDER] =
      {
        orderId,
        orderedMeals: mealsDetails.meals,
        totalPrice: mealsDetails.totalPrice,
      };

    await this.ordersQueue.add(
      EOrderJobNames.DELIVER_ORDER,
      deliverOrderJobPayload,
    );
  }

  private async handleServeMealJob(
    jobPayload: CompleteOrderJob,
  ): Promise<void> {
    console.log('Enjoy your meal!');
    const completeOrderJobPayload: TOrderJobsMap[EOrderJobNames.COMPLETE_ORDER] =
      {
        orderId: jobPayload.orderId,
      };

    await this.ordersQueue.add(
      EOrderJobNames.COMPLETE_ORDER,
      completeOrderJobPayload,
    );
  }
}
