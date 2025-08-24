import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';
import { ECategoryName } from '@shared/models/category.model';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: CategoriesRepository;

  const mockRepository = {
    findAll: jest.fn(),
    upsertCategoryByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: CategoriesRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<CategoriesRepository>(CategoriesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCategoryList', () => {
    it('should map repository results to response DTOs', async () => {
      const mockDocs = [{ _id: '123', name: ECategoryName.RAMEN }];
      mockRepository.findAll.mockResolvedValue(mockDocs);

      const result = await service.getCategoryList({ limit: 10, page: 1 });

      expect(result).toEqual([{ id: '123', name: ECategoryName.RAMEN }]);
      expect(mockRepository.findAll).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
      });
    });
  });

  describe('onModuleInit', () => {
    it('should call upsertCategoryByName for each category', async () => {
      mockRepository.upsertCategoryByName.mockResolvedValue(undefined);

      await service.onModuleInit();

      const categories = Object.values(ECategoryName);
      for (const category of categories) {
        expect(mockRepository.upsertCategoryByName).toHaveBeenCalledWith({
          name: category,
        });
      }
    });
  });
});
