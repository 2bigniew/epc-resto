import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ECategoryName } from '../models/category.model';
import { EMealName } from '../models/meal.model';

export const MEAL_MODEL_NAME = 'Meal';
export const MEAL_COLLECTION_NAME = 'meal';

@Schema({
  collection: MEAL_COLLECTION_NAME,
  timestamps: true,
  autoIndex: false,
})
export class MealEntity extends Document<Types.ObjectId> {
  public createdAt!: Date;
  public updatedAt!: Date;

  @Prop({ required: true })
  public name!: EMealName;

  @Prop({ required: true })
  public category!: ECategoryName;

  @Prop({ required: true })
  public price!: number;
}

export const MealEntitySchema = SchemaFactory.createForClass(MealEntity);
