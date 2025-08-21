import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MealsService } from './meals.service';
import { MealReadRequestQueryDto } from '@meals/dtos/meal-read.dto';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @ApiOperation({ summary: 'Read meals by category name (with pagination)' })
  @Get('/')
  getMeals(@Query() query: MealReadRequestQueryDto) {
    const { limit, page, category } = query;
    return this.mealsService.findAllByCategoryName({
      limit,
      page,
      categoryName: category,
    });
  }
}
