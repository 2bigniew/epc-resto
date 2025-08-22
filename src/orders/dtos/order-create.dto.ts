import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';
import { EMealName } from '@shared/models/meal.model';

export class OrderCreateOneRequestDto {
  @ApiProperty({ description: 'Ordered meal name' })
  @IsEnum(EMealName, { each: true })
  @IsArray()
  public mealNames!: EMealName[];
}
