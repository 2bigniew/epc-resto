import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ECategoryName } from '../models/category.model';

export const CATEGORY_MODEL_NAME = 'Category';
export const CATEGORY_COLLECTION_NAME = 'category';

@Schema({
  collection: CATEGORY_COLLECTION_NAME,
  timestamps: true,
  autoIndex: false,
})
export class CategoryEntity extends Document<Types.ObjectId> {
  public createdAt!: Date;
  public updatedAt!: Date;

  @Prop({ required: true })
  public name!: ECategoryName;
}

export const CategoryEntitySchema =
  SchemaFactory.createForClass(CategoryEntity);
