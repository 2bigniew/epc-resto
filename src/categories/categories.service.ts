import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoryEntity } from '@shared/schemas/category.schema';
import { CategoriesRepository } from '@categories/categories.repository';
import { ECategoryName } from '@shared/models/category.model';
import { CategoriesReadResponseDto } from '@categories/dtos/categories-read.dto';

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  public async onModuleInit(): Promise<void> {
    /**
     * FYI I designed it like that in purpose to have a full functionality ready to go.
     * In real app, those would be probably set from some kind of admin panel level,
     * or by csv import etc.
     */
    await this.initCategoryDocuments();
  }

  public async getCategoryList({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }): Promise<CategoriesReadResponseDto[]> {
    const categories = await this.categoriesRepository.findAll({ limit, page });
    return categories.map((doc) => this.mapEntityToResponse(doc));
  }

  private async initCategoryDocuments(): Promise<void> {
    const categories = Object.values(ECategoryName);

    for (const category of categories) {
      await this.categoriesRepository.upsertCategoryByName({
        name: category,
      });
    }
  }

  private mapEntityToResponse(doc: CategoryEntity): CategoriesReadResponseDto {
    const { _id, name } = doc;

    return {
      id: _id.toString(),
      name,
    };
  }
}
