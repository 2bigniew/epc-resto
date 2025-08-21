import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import {
  CategoriesReadRequestQueryDto,
  CategoriesReadResponseDto,
} from '@categories/dtos/categories-read.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Read meal categories (with pagination)' })
  @Get('/')
  getCategories(
    @Query() query: CategoriesReadRequestQueryDto,
  ): Promise<CategoriesReadResponseDto[]> {
    const { limit, page } = query;
    return this.categoriesService.getCategoryList({ limit, page });
  }
}
