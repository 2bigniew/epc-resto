import { EMealName, PublicMeal } from '@shared/models/meal.model';

export enum EOrderJobNames {
  CREATE_ORDER = 'createOrder',
  PROCESS_ORDER = 'processOrder',
  DELIVER_ORDER = 'deliverOrder',
  COMPLETE_ORDER = 'orderCompleted',
}

export class CreateOrderJob {
  public orderId!: string;
  public orderedMealsNames!: EMealName[];
}
export class ProcessOrderJob {
  public orderId!: string;
}

export class DeliverOrderJob {
  public orderId!: string;
  public orderedMeals!: PublicMeal[];
  public totalPrice!: number;
}

export class CompleteOrderJob {
  public orderId!: string;
}

export type TOrderJobs =
  | CreateOrderJob
  | ProcessOrderJob
  | DeliverOrderJob
  | CompleteOrderJob;

export type TOrderJobsMap = {
  [EOrderJobNames.CREATE_ORDER]: CreateOrderJob;
  [EOrderJobNames.PROCESS_ORDER]: ProcessOrderJob;
  [EOrderJobNames.DELIVER_ORDER]: DeliverOrderJob;
  [EOrderJobNames.COMPLETE_ORDER]: CompleteOrderJob;
};
