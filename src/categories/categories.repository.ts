import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CATEGORY_MODEL_NAME,
  CategoryEntity,
} from '@shared/schemas/category.schema';

type CreateCategoryPayload = Pick<CategoryEntity, 'name'>;

@Injectable()
export class CategoriesRepository {
  public constructor(
    @InjectModel(CATEGORY_MODEL_NAME)
    private readonly model: Model<CategoryEntity>,
  ) {}

  public async findAll({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }): Promise<CategoryEntity[]> {
    return this.model
      .find({})
      .sort({ _id: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean()
      .exec();
  }

  public async upsertCategoryByName(
    payload: CreateCategoryPayload,
  ): Promise<void> {
    await this.model.updateOne(
      { name: payload.name },
      { $setOnInsert: payload },
      { upsert: true },
    );
  }
}
