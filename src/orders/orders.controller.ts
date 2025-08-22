import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IsUUIDHandler } from '@shared/helpers/validators';
import { OrdersService } from './orders.service';
import {
  OrderReadManyRequestQueryDto,
  OrderReadResponseDto,
} from '@orders/dtos/order-read.dto';
import { OrderCreateOneRequestDto } from '@orders/dtos/order-create.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/')
  async createOrder(@Body() payload: OrderCreateOneRequestDto): Promise<void> {
    const { mealNames } = payload;

    await this.ordersService.startCreateOrderJob(mealNames);
  }

  @ApiOperation({ summary: 'Read orders by order status (with pagination)' })
  @Get('/')
  getOrders(
    @Query() query: OrderReadManyRequestQueryDto,
  ): Promise<OrderReadResponseDto[]> {
    const { limit, page, status } = query;
    return this.ordersService.findAllByStatus({ limit, page, status });
  }

  @ApiOperation({ summary: 'Read single order by orderId' })
  @Get('/:orderId')
  getOrder(
    @Param('orderId', IsUUIDHandler) orderId: string,
  ): Promise<OrderReadResponseDto | undefined> {
    // FIXME handle 404

    return this.ordersService.findOneByOrderId(orderId);
  }
}
