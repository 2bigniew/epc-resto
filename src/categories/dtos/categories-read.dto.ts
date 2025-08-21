import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoriesReadRequestQueryDto {
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
}

export class CategoriesReadResponseDto {
  @ApiProperty({ description: 'Meal category ID' })
  public id!: string;

  @ApiProperty({ description: 'Meal category name' })
  public name!: string;
}
