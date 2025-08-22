import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { MEAL_MODEL_NAME, MealEntity } from '@shared/schemas/meal.schema';
import { ECategoryName } from '@shared/models/category.model';
import { EMealName } from '@shared/models/meal.model';

export type CreateMealPayload = Pick<MealEntity, 'name' | 'category' | 'price'>;

@Injectable()
export class MealsRepository {
  public constructor(
    @InjectModel(MEAL_MODEL_NAME)
    private readonly model: Model<MealEntity>,
  ) {}

  public async findAllByMealsNamesList(
    mealsNames: EMealName[],
  ): Promise<MealEntity[]> {
    return this.model
      .find({ name: { $in: mealsNames } })
      .lean()
      .exec();
  }

  public async findAllByFilters({
    limit,
    page,
    categoryName,
  }: {
    limit: number;
    page: number;
    categoryName?: ECategoryName;
  }): Promise<MealEntity[]> {
    const filters = this.buildMealFilters(categoryName);

    return this.model
      .find(filters)
      .sort({ _id: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean()
      .exec();
  }

  public async upsertMealByPayload(payload: CreateMealPayload): Promise<void> {
    await this.model.updateOne(
      { name: payload.name },
      { $setOnInsert: payload },
      { upsert: true },
    );
  }

  private buildMealFilters(
    categoryName?: ECategoryName,
  ): Partial<FilterQuery<MealEntity>> {
    const filters: Partial<FilterQuery<MealEntity>> = {};

    if (categoryName) {
      filters.category = categoryName;
    }

    return filters;
  }
}
