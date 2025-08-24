import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { ECategoryName } from '@shared/models/category.model';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockService = {
    getCategoryList: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: mockService }],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCategories', () => {
    it('should call service and return response', async () => {
      const mockResponse = [{ id: '1', name: ECategoryName.RAMEN }];
      mockService.getCategoryList.mockResolvedValue(mockResponse);

      const result = await controller.getCategories({ limit: 10, page: 1 });

      expect(result).toEqual(mockResponse);
      expect(mockService.getCategoryList).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
      });
    });
  });
});
