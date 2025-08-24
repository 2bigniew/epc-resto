import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OrderRepository } from './order.repository';
import { EOrderJobNames } from '@shared/jobs/order.job';
import { OrdersService } from './orders.service';
import { EOrderStatus } from '@shared/models/order.model';
import { EMealName } from '@shared/models/meal.model';
import { ECategoryName } from '@shared/models/category.model';

const ORDERS_QUEUE_KEY = 'orders_queue';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}));

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: OrderRepository;
  let ordersQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrderRepository,
          useValue: {
            createOrder: jest.fn(),
            updateOrderByFilter: jest.fn(),
            findAllByFilters: jest.fn(),
            findOneByFilters: jest.fn(),
          },
        },
        {
          provide: getQueueToken(ORDERS_QUEUE_KEY),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<OrderRepository>(OrderRepository);
    ordersQueue = module.get<Queue>(getQueueToken(ORDERS_QUEUE_KEY));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startCreateOrderJob', () => {
    it('should add job to ordersQueue', async () => {
      const mealNames = [
        EMealName.UNI_AND_TORO_SUSHI,
        EMealName.CHIRASHI_SUSHI,
      ];
      await service.startCreateOrderJob(mealNames);

      expect(ordersQueue.add).toHaveBeenCalledWith(
        EOrderJobNames.CREATE_ORDER,
        {
          orderId: 'mocked-uuid',
          orderedMealsNames: mealNames,
        },
      );
    });
  });

  describe('createOrder', () => {
    it('should call repository.createOrder with correct payload', async () => {
      const payload = {
        orderId: 'order-id',
        orderedMealsNames: [
          EMealName.UNI_AND_TORO_SUSHI,
          EMealName.CHIRASHI_SUSHI,
        ],
      };
      await service.createOrder(payload);

      expect(repository.createOrder).toHaveBeenCalledWith({
        orderId: 'order-id',
        status: EOrderStatus.NEW,
      });
    });
  });

  describe('markOrderAsInTheKitchen', () => {
    it('should update order status to IN_THE_KITCHEN', async () => {
      await service.markOrderAsInTheKitchen('order-id');

      expect(repository.updateOrderByFilter).toHaveBeenCalledWith(
        { status: EOrderStatus.IN_THE_KITCHEN },
        { orderId: 'order-id' },
      );
    });
  });

  describe('markOrderAsDone', () => {
    it('should update order status to DONE', async () => {
      await service.markOrderAsDone('order-id');

      expect(repository.updateOrderByFilter).toHaveBeenCalledWith(
        { status: EOrderStatus.DONE },
        { orderId: 'order-id' },
      );
    });
  });

  describe('findAllByStatus', () => {
    it('should map entities to response', async () => {
      (repository.findAllByFilters as jest.Mock).mockResolvedValue([
        {
          _id: '123',
          orderId: 'order-1',
          status: EOrderStatus.NEW,
          orderedMeals: [
            {
              name: EMealName.CHIRASHI_SUSHI,
              category: ECategoryName.SUSHI,
              price: 1000,
            },
          ],
          totalPrice: 1000,
        },
      ]);

      const result = await service.findAllByStatus({
        limit: 10,
        page: 1,
        status: EOrderStatus.NEW,
      });

      expect(result).toEqual([
        {
          id: '123',
          orderId: 'order-1',
          status: EOrderStatus.NEW,
          orderedMeals: [
            {
              name: EMealName.CHIRASHI_SUSHI,
              category: ECategoryName.SUSHI,
              price: 10,
            },
          ],
          totalPrice: 10,
        },
      ]);
    });
  });

  describe('findOneByOrderId', () => {
    it('should return undefined if order not found', async () => {
      (repository.findOneByFilters as jest.Mock).mockResolvedValue(undefined);
      const result = await service.findOneByOrderId('non-existent');
      expect(result).toBeUndefined();
    });

    it('should return mapped response if order found', async () => {
      (repository.findOneByFilters as jest.Mock).mockResolvedValue({
        _id: '123',
        orderId: 'order-1',
        status: EOrderStatus.NEW,
        orderedMeals: [
          {
            name: EMealName.CHIRASHI_SUSHI,
            category: ECategoryName.SUSHI,
            price: 1000,
          },
        ],
        totalPrice: 1000,
      });

      const result = await service.findOneByOrderId('order-1');

      expect(result).toEqual({
        id: '123',
        orderId: 'order-1',
        status: EOrderStatus.NEW,
        orderedMeals: [
          {
            name: EMealName.CHIRASHI_SUSHI,
            category: ECategoryName.SUSHI,
            price: 10,
          },
        ],
        totalPrice: 10,
      });
    });
  });
});
