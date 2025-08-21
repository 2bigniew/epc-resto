import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ORDER_MODEL_NAME, OrderEntity } from '@shared/schemas/order.schema';

export type TOrderCreatePayload = Pick<OrderEntity, 'orderId' | 'status'>;

export type TOrderUpdateOrderedMealsPayload = Required<
  Pick<OrderEntity, 'orderedMeals' | 'totalPrice'>
>;

export type TReadFiltersPayload = Partial<
  Pick<OrderEntity, 'status' | 'orderId'>
>;

@Injectable()
export class OrderRepository {
  public constructor(
    @InjectModel(ORDER_MODEL_NAME)
    private readonly model: Model<OrderEntity>,
  ) {}

  public async createOrder(payload: TOrderCreatePayload): Promise<void> {
    await this.model.create(payload);
  }

  public async findAllByFilters({
    limit,
    page,
    payload,
  }: {
    limit: number;
    page: number;
    payload: TReadFiltersPayload;
  }): Promise<OrderEntity[]> {
    const { status } = payload;
    const filters = this.buildOrderFilters({ status });

    return this.model
      .find(filters)
      .sort({ _id: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean()
      .exec();
  }

  public async findOneByFilters(
    payload: TReadFiltersPayload,
  ): Promise<OrderEntity | undefined> {
    const filters = this.buildOrderFilters(payload);
    const doc = await this.model.findOne(filters).lean().exec();
    return doc ? doc : undefined;
  }

  public buildOrderFilters(
    payload: TReadFiltersPayload,
  ): Partial<FilterQuery<OrderEntity>> {
    const { status, orderId } = payload;
    const filters: Partial<FilterQuery<OrderEntity>> = {};

    if (status) {
      filters.status = status;
    }

    if (orderId) {
      filters.orderId = orderId;
    }

    return filters;
  }
}
