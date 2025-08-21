import { PublicMeal } from './meal.model';

export enum EOrderStatus {
  NEW = 'new', // just placed
  IN_THE_KITCHEN = 'inTheKitchen', // preparing
  IN_DELIVERY = 'inDelivery', // ready for waitstaff to serve
  DONE = 'done', // delivered to the guest
}

export class PublicOrder {
  public id!: string;
  public status!: EOrderStatus;
  public meals!: PublicMeal[];
  public totalPrice!: number;
}
