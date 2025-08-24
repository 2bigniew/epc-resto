import { Test, TestingModule } from '@nestjs/testing';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { ECategoryName } from '@shared/models/category.model';
import { EMealName } from '@shared/models/meal.model';
import { MealReadResponseDto } from '@meals/dtos/meal-read.dto';

describe('MealsController', () => {
  let controller: MealsController;
  let service: MealsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealsController],
      providers: [
        {
          provide: MealsService,
          useValue: {
            findAllByCategoryName: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MealsController>(MealsController);
    service = module.get<MealsService>(MealsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMeals', () => {
    it('should call mealsService.findAllByCategoryName with correct params', async () => {
      const mockResult: MealReadResponseDto[] = [
        {
          id: '1',
          name: EMealName.SHOYU_RAMEN_WITH_GRILLED_CHICKEN,
          category: ECategoryName.RAMEN,
          price: 3.5,
        },
      ];

      (service.findAllByCategoryName as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const query = {
        limit: 10,
        page: 1,
        category: ECategoryName.RAMEN,
      };

      const result = await controller.getMeals(query);

      expect(service.findAllByCategoryName).toHaveBeenCalledWith({
        limit: 10,
        page: 1,
        categoryName: ECategoryName.RAMEN,
      });

      expect(result).toEqual(mockResult);
    });
  });
});
