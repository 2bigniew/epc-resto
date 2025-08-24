import { Injectable, OnModuleInit } from '@nestjs/common';
import { MealEntity } from '@shared/schemas/meal.schema';
import { CreateMealPayload, MealsRepository } from '@meals/meals.repository';
import { EMealName, PublicMeal } from '@shared/models/meal.model';
import { ECategoryName } from '@shared/models/category.model';
import { MealReadResponseDto } from '@meals/dtos/meal-read.dto';

@Injectable()
export class MealsService implements OnModuleInit {
  public constructor(private readonly mealsRepository: MealsRepository) {}

  public async onModuleInit(): Promise<void> {
    /**
     * FYI I designed it like that in purpose to have a full functionality ready to go.
     * In real app, those would be probably set from some kind of admin panel level,
     * or by csv import etc.
     */
    await this.initMealDocuments();
  }

  public async getMealsDetailsByName(
    mealsNames: EMealName[],
  ): Promise<{ meals: PublicMeal[]; totalPrice: number }> {
    const docs = await this.mealsRepository.findAllByMealsNamesList(mealsNames);
    const meals = this.mapEntitiesToPublicMealsByName(mealsNames, docs);
    const totalPrice = this.getTotalPriceOfMeals(mealsNames, docs);

    return { meals, totalPrice };
  }

  public async findAllByCategoryName({
    limit,
    page,
    categoryName,
  }: {
    limit: number;
    page: number;
    categoryName?: ECategoryName;
  }): Promise<MealReadResponseDto[]> {
    const documents = await this.mealsRepository.findAllByFilters({
      limit,
      page,
      categoryName,
    });
    return documents.map((doc) => this.mapEntityToResponse(doc));
  }

  private async initMealDocuments(): Promise<void> {
    const payload: CreateMealPayload[] = [
      {
        name: EMealName.SHOYU_RAMEN_WITH_GRILLED_CHICKEN,
        category: ECategoryName.RAMEN,
        price: 350,
      },
      {
        name: EMealName.SPICY_MISO_TONKOTSU_RAMEN,
        category: ECategoryName.RAMEN,
        price: 380,
      },
      {
        name: EMealName.CHIRASHI_SUSHI,
        category: ECategoryName.SUSHI,
        price: 420,
      },
      {
        name: EMealName.UNI_AND_TORO_SUSHI,
        category: ECategoryName.SUSHI,
        price: 450,
      },
    ];

    for (const meal of payload) {
      await this.mealsRepository.upsertMealByPayload(meal);
    }
  }

  private mapEntityToResponse(doc: MealEntity): MealReadResponseDto {
    return {
      id: doc._id.toString(),
      name: doc.name,
      category: doc.category,
      price: doc.price,
    };
  }

  private mapEntitiesToPublicMealsByName(
    mealNames: EMealName[],
    docs: MealEntity[],
  ): PublicMeal[] {
    const mealsDetails: PublicMeal[] = [];

    for (const meal of mealNames) {
      const document = docs.find((doc) => doc.name === meal);

      if (document) {
        mealsDetails.push({
          name: document.name,
          category: document.category,
          price: document.price,
        });
      }
    }
    return mealsDetails;
  }

  private getTotalPriceOfMeals(
    mealNames: EMealName[],
    docs: MealEntity[],
  ): number {
    let totalPrice = 0;

    for (const meal of mealNames) {
      const document = docs.find((doc) => doc.name === meal);

      if (document) {
        totalPrice += document.price;
      }
    }

    if (totalPrice <= 0) {
      return 0;
    }

    return totalPrice;
  }
}
