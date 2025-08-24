import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { EOrderStatus } from '@shared/models/order.model';
import { EMealName } from '@shared/models/meal.model';
import { OrderReadResponseDto } from './dtos/order-read.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            startCreateOrderJob: jest.fn(),
            findAllByStatus: jest.fn(),
            findOneByOrderId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should call service.startCreateOrderJob with meal names', async () => {
      const payload = {
        mealNames: [EMealName.UNI_AND_TORO_SUSHI, EMealName.CHIRASHI_SUSHI],
      };
      await controller.createOrder(payload);

      expect(service.startCreateOrderJob).toHaveBeenCalledWith(
        payload.mealNames,
      );
    });
  });

  describe('getOrders', () => {
    it('should return orders from service.findAllByStatus', async () => {
      const query = { limit: 10, page: 1, status: EOrderStatus.NEW };
      const mockResponse: OrderReadResponseDto[] = [
        {
          id: '1',
          orderId: 'order-1',
          status: EOrderStatus.NEW,
          orderedMeals: [],
          totalPrice: 0,
        },
      ];

      (service.findAllByStatus as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.getOrders(query);

      expect(service.findAllByStatus).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getOrder', () => {
    it('should return order from service.findOneByOrderId', async () => {
      const orderId = 'order-123';
      const mockResponse: OrderReadResponseDto = {
        id: '1',
        orderId,
        status: EOrderStatus.NEW,
        orderedMeals: [],
        totalPrice: 0,
      };

      (service.findOneByOrderId as jest.Mock).mockResolvedValue(mockResponse);

      const result = await controller.getOrder(orderId);

      expect(service.findOneByOrderId).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockResponse);
    });

    it('should return undefined if order not found', async () => {
      const orderId = 'non-existent';
      (service.findOneByOrderId as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.getOrder(orderId);

      expect(result).toBeUndefined();
    });
  });
});
