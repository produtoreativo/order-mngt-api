import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Headers,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderResponseDto } from './dto/get-order-response.dto';
import { CreateOrderValidationInterceptor } from './interceptors/create-order-validation.interceptor';
import { TransformResponseInterceptor } from '../interceptors/transform-response.interceptor';
import { GetOrderValidationInterceptor } from './interceptors/get-order-validation.interceptor';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@UseInterceptors(TransformResponseInterceptor)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto, description: 'Order data' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
    type: GetOrderResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid order data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(CreateOrderValidationInterceptor)
  async createOrder(
    @Body() orderDto: CreateOrderDto,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    const token = authorizationHeader.split(' ')[1];
    const order = await this.orderService.createOrder(orderDto, token);
    return order;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the order to retrieve',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Order retrieved successfully.',
    type: GetOrderResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseInterceptors(GetOrderValidationInterceptor)
  async getOrder(
    @Param('id') id: string,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    const token = authorizationHeader.split(' ')[1];
    const order = await this.orderService.getOrder(id, token);
    return order;
  }
}
