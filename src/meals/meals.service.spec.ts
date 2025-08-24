import { Test, TestingModule } from '@nestjs/testing';
import { MealsRepository } from '@meals/meals.repository';
import { MealsService } from './meals.service';
import { EMealName } from '@shared/models/meal.model';
import { ECategoryName } from '@shared/models/category.model';

describe('MealsService', () => {
  let service: MealsService;
  let repository: MealsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MealsService,
        {
          provide: MealsRepository,
          useValue: {
            findAllByMealsNamesList: jest.fn(),
            findAllByFilters: jest.fn(),
            upsertMealByPayload: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MealsService>(MealsService);
    repository = module.get<MealsRepository>(MealsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMealsDetailsByName', () => {
    it('should return meals details and total price', async () => {
      const mealNames: EMealName[] = [
        EMealName.SHOYU_RAMEN_WITH_GRILLED_CHICKEN,
      ];
      const mockEntities = [
        {
          _id: '1',
          name: EMealName.SHOYU_RAMEN_WITH_GRILLED_CHICKEN,
          category: ECategoryName.RAMEN,
          price: 350,
        },
      ];

      (repository.findAllByMealsNamesList as jest.Mock).mockResolvedValue(
        mockEntities,
      );

      const result = await service.getMealsDetailsByName(mealNames);

      expect(repository.findAllByMealsNamesList).toHaveBeenCalledWith(
        mealNames,
      );
      expect(result).toEqual({
        meals: [
          {
            name: EMealName.SHOYU_RAMEN_WITH_GRILLED_CHICKEN,
            category: ECategoryName.RAMEN,
            price: 3.5,
          },
        ],
        totalPrice: 3.5,
      });
    });

    it('should return empty array and 0 if no meals found', async () => {
      const mealNames: EMealName[] = [
        EMealName.SHOYU_RAMEN_WITH_GRILLED_CHICKEN,
      ];
      (repository.findAllByMealsNamesList as jest.Mock).mockResolvedValue([]);

      const result = await service.getMealsDetailsByName(mealNames);

      expect(result).toEqual({ meals: [], totalPrice: 0 });
    });
  });

  describe('findAllByCategoryName', () => {
    it('should return mapped meal DTOs', async () => {
      const mockEntities = [
        {
          _id: '1',
          name: EMealName.SHOYU_RAMEN_WITH_GRILLED_CHICKEN,
          category: ECategoryName.RAMEN,
          price: 350,
        },
      ];

      (repository.findAllByFilters as jest.Mock).mockResolvedValue(
        mockEntities,
      );

      const result = await service.findAllByCategoryName({
        limit: 10,
        page: 1,
        categoryName: ECategoryName.RAMEN,
      });

      expect(repository.findAllByFilters).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
        categoryName: ECategoryName.RAMEN,
      });

      expect(result).toEqual([
        {
          id: '1',
          name: EMealName.SHOYU_RAMEN_WITH_GRILLED_CHICKEN,
          category: ECategoryName.RAMEN,
          price: 3.5,
        },
      ]);
    });
  });

  describe('onModuleInit', () => {
    it('should call repository.upsertMealByPayload for each default meal', async () => {
      const upsertSpy = jest
        .spyOn(repository, 'upsertMealByPayload')
        .mockResolvedValue();

      await service.onModuleInit();

      // Default payload has 4 meals
      expect(upsertSpy).toHaveBeenCalledTimes(4);

      expect(upsertSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: EMealName.SHOYU_RAMEN_WITH_GRILLED_CHICKEN,
        }),
      );
    });
  });
});
