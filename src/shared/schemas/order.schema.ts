import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ECategoryName } from '@shared/models/category.model';
import { EOrderStatus } from '../models/order.model';
import { EMealName } from '@shared/models/meal.model';

export const ORDER_MODEL_NAME = 'Order';
export const ORDER_COLLECTION_NAME = 'order';

export class OrderedMeal {
  public name!: EMealName;
  public category!: ECategoryName;
  public price!: number;
}

@Schema({
  collection: ORDER_COLLECTION_NAME,
  timestamps: true,
  autoIndex: false,
})
export class OrderEntity extends Document<Types.ObjectId> {
  public createdAt!: Date;
  public updatedAt!: Date;

  @Prop({ required: true })
  public orderId!: string; /* UUID */

  @Prop({ required: true })
  public status!: EOrderStatus;

  @Prop({ required: false })
  public orderedMeals?: OrderedMeal[];

  @Prop({ required: false })
  public totalPrice?: number;
}

export const OrderEntitySchema = SchemaFactory.createForClass(OrderEntity);
