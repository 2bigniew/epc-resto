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

export enum EJobStatus {
  ACTIVE = 'active',
  DELAYED = 'delayed',
  PRIORITIZED = 'prioritized',
  WAITING = 'waiting',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class OrderQueueReadRequestQueryDto {
  @ApiPropertyOptional({ description: 'Start index' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  public startIndex: number = 0;

  @ApiPropertyOptional({ description: 'End Index' })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  public endIndex: number = 1;

  @ApiPropertyOptional({ description: 'Filter job queue by job status' })
  @IsEnum(EJobStatus)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  public jobStatus?: EJobStatus;
}

export class OrderQueueReadResponseDto<T> {
  @ApiProperty({ description: 'Job id' })
  public id?: string | number;

  @ApiProperty({ description: 'Job name' })
  public name!: string;

  @ApiProperty({ description: 'Job payload' })
  public data!: T;

  @ApiProperty({ description: 'Attempts made' })
  public attemptsMade!: number;

  @ApiProperty({ description: 'Processed on' })
  public processedOn?: string; /* iso string */

  @ApiProperty({ description: 'Finished on' })
  public finishedOn?: string; /* iso string */

  @ApiProperty({ description: 'Failed reasons' })
  public failedReason?: string;

  @ApiProperty({ description: 'Timestamp' })
  public timestamp!: number;
}
