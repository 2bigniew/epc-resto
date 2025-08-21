import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ECategoryName } from '@shared/models/category.model';
import { EMealName } from '@shared/models/meal.model';

export class MealReadRequestQueryDto {
  @ApiPropertyOptional({ description: 'Limit' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  public limit: number = 50;

  @ApiPropertyOptional({ description: 'Page' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public page: number = 1;

  @ApiPropertyOptional({ description: 'Filter by meal category name' })
  @IsEnum(ECategoryName)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public category?: ECategoryName;
}

export class MealReadResponseDto {
  @ApiProperty({ description: 'Meal ID' })
  public id!: string;

  @ApiProperty({ description: 'Meal name' })
  public name!: EMealName;

  @ApiProperty({ description: 'Meal category name' })
  public category!: ECategoryName;

  @ApiProperty({ description: 'Meal price (USD)' })
  public price!: number;
}
