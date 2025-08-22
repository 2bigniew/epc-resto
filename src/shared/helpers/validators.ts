import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class IsUUIDHandler implements PipeTransform<any, string> {
  public transform(value: unknown): string {
    const validObjectId = isUUID(value);
    if (!validObjectId) {
      throw new BadRequestException('Invalid UUID orderId string');
    }

    return value as string;
  }
}
