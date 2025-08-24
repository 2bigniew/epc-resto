import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { MEAL_MODEL_NAME, MealEntitySchema } from '@shared/schemas/meal.schema';
import { MealsRepository } from '@meals/meals.repository';
import { MealsProcessor } from '@meals/meals.processor';
import { ORDERS_QUEUE_KEY } from '@orders/orders.consts';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { MEALS_QUEUE_KEY } from '@meals/meals.const.dto';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MEAL_MODEL_NAME, schema: MealEntitySchema },
    ]),
    BullModule.registerQueue({
      name: MEALS_QUEUE_KEY,
      defaultJobOptions: {
        priority: 1,
        attempts: 3,
        removeOnComplete: false,
        removeOnFail: false,
      },
    }),
    BullModule.registerQueue({
      name: ORDERS_QUEUE_KEY,
      defaultJobOptions: {
        priority: 1,
        attempts: 3,
        removeOnComplete: false,
        removeOnFail: false,
      },
    }),
  ],
  controllers: [MealsController],
  providers: [MealsService, MealsRepository, MealsProcessor],
})
export class MealsModule {}
