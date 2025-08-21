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
import { EOrderStatus } from '@shared/models/order.model';
import { EMealName } from '@shared/models/meal.model';
import { ECategoryName } from '@shared/models/category.model';

export class OrderReadManyRequestQueryDto {
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

  @ApiProperty({ description: 'Filter by order status' })
  @IsEnum(EOrderStatus)
  @IsString()
  @IsNotEmpty()
  public status!: EOrderStatus;
}

export class OrderedMealDto {
  @ApiProperty({ description: 'Meal name' })
  public name!: EMealName;

  @ApiProperty({ description: 'Meal category name' })
  public category!: ECategoryName;

  @ApiProperty({ description: 'Meal price (USD)' })
  public price!: number;
}

export class OrderReadResponseDto {
  @ApiProperty({ description: 'Order document Id' })
  public id!: string;

  @ApiProperty({ description: 'Order id (format: UUID)' })
  public orderId!: string;

  @ApiProperty({ description: 'Order status' })
  public status!: EOrderStatus;

  @ApiPropertyOptional({ description: 'List of ordered meals' })
  public orderedMeals?: OrderedMealDto[];

  @ApiPropertyOptional({ description: 'Order total price (USD)' })
  public totalPrice?: number;
}
