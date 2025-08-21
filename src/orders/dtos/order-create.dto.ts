import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EMealName } from '@shared/models/meal.model';

export class OrderCreateOneRequestDto {
  @ApiProperty({ description: 'Ordered meal name' })
  @IsEnum(EMealName, { each: true })
  public mealNames!: EMealName[];
}
