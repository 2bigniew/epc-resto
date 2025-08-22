import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { ORDERS_QUEUE_KEY } from '@orders/orders.consts';
import { OrderRepository } from '@orders/order.repository';
import { OrderEntity } from '@shared/schemas/order.schema';
import {
  CreateOrderJob,
  EOrderJobNames,
  TOrderJobsMap,
} from '@shared/jobs/order.job';
import { EOrderStatus } from '@shared/models/order.model';
import { EMealName, PublicMeal } from '@shared/models/meal.model';
import { OrderReadResponseDto } from '@orders/dtos/order-read.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectQueue(ORDERS_QUEUE_KEY)
    private readonly ordersQueue: Queue,
    private readonly ordersRepository: OrderRepository,
  ) {}

  public async startCreateOrderJob(mealNames: EMealName[]): Promise<void> {
    const orderId = this.createOrderId();

    const eventPayload: TOrderJobsMap[EOrderJobNames.CREATE_ORDER] = {
      orderId,
      orderedMealsNames: mealNames,
    };

    const eventName = EOrderJobNames.CREATE_ORDER;

    await this.ordersQueue.add(eventName, eventPayload);
  }

  public async createOrder(payload: CreateOrderJob): Promise<void> {
    const { orderId } = payload;
    const status = EOrderStatus.NEW;
    await this.ordersRepository.createOrder({ orderId, status });
  }

  public async markOrderAsInTheKitchen(orderId: string): Promise<void> {
    const status = EOrderStatus.IN_THE_KITCHEN;
    await this.ordersRepository.updateOrderByFilter({ status }, { orderId });
  }

  public async updateOrderInDeliveryDetails(payload: {
    orderId: string;
    orderedMeals: PublicMeal[];
    totalPrice: number;
  }): Promise<void> {
    const status = EOrderStatus.IN_DELIVERY;
    const { totalPrice, orderedMeals, orderId } = payload;
    await this.ordersRepository.updateOrderByFilter(
      {
        status,
        orderedMeals,
        totalPrice,
      },
      { orderId },
    );
  }

  public async markOrderAsDone(orderId: string): Promise<void> {
    const status = EOrderStatus.DONE;
    await this.ordersRepository.updateOrderByFilter({ status }, { orderId });
  }

  public async findAllByStatus({
    limit,
    page,
    status,
  }: {
    limit: number;
    page: number;
    status: EOrderStatus;
  }): Promise<OrderReadResponseDto[]> {
    const docs = await this.ordersRepository.findAllByFilters({
      limit,
      page,
      payload: { status },
    });

    return docs.map((doc) => this.mapEntityToPublicResponse(doc));
  }

  public async findOneByOrderId(
    orderId: string,
  ): Promise<OrderReadResponseDto | undefined> {
    const doc = await this.ordersRepository.findOneByFilters({ orderId });

    if (!doc) {
      return;
    }

    return this.mapEntityToPublicResponse(doc);
  }

  private mapEntityToPublicResponse(doc: OrderEntity): OrderReadResponseDto {
    const orderedMealsWithMoney = doc.orderedMeals?.map((doc) => ({
      name: doc.name,
      category: doc.category,
      price: doc.price / 100,
    }));

    return {
      id: doc._id.toString(),
      orderId: doc.orderId,
      status: doc.status,
      orderedMeals: orderedMealsWithMoney,
      totalPrice: doc.totalPrice ? doc.totalPrice / 100 : undefined,
    };
  }

  private createOrderId(): string {
    return uuidv4();
  }
}
