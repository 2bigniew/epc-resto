import { EOrderStatus } from '@shared/models/order.model';
import { EMealName, PublicMeal } from '@shared/models/meal.model';

export enum EOrderEventsNames {
  ORDER_CREATED = 'orderCreated',
  ORDER_ORDERED_MEALS_UPDATED = 'orderOrderedMealsUpdated',
}

export class OrderCreatedEvent {
  public orderId!: string;
  public status!: EOrderStatus;
  public orderedMealsNames!: EMealName[];
}

export class OrderMealsUpdatedEvent {
  public orderId!: string;
  public status!: EOrderStatus;
  public orderedMeals!: PublicMeal[];
}

export type TOrderEvents = OrderCreatedEvent | OrderMealsUpdatedEvent;

export type TOrderEventsMap = {
  [EOrderEventsNames.ORDER_CREATED]: OrderCreatedEvent;
  [EOrderEventsNames.ORDER_ORDERED_MEALS_UPDATED]: OrderMealsUpdatedEvent;
};
