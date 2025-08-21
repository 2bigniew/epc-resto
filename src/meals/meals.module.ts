import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MEAL_MODEL_NAME, MealEntitySchema } from '@shared/schemas/meal.schema';
import { MealsRepository } from '@meals/meals.repository';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MEAL_MODEL_NAME, schema: MealEntitySchema },
    ]),
  ],
  controllers: [MealsController],
  providers: [MealsService, MealsRepository],
})
export class MealsModule {}
