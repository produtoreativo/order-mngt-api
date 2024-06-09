import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseInterceptors,
  Headers,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderResponseDto } from './dto/get-order-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthValidationInterceptor } from './interceptors/auth-validation.interceptor';
import { CreateOrderValidationInterceptor } from './interceptors/create-order-validation.interceptor';
import { TransformResponseInterceptor } from '../interceptors/transform-response.interceptor';
import { ValidateResponseInterceptor } from '../interceptors/validate-response.interceptor'; // Import do interceptor de validação

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@UseInterceptors(AuthValidationInterceptor, TransformResponseInterceptor) // Adiciona o interceptor de validação aqui
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
    try {
      const order = await this.orderService.createOrder(orderDto, token);
      return new GetOrderResponseDto(order); // Certifique-se de criar uma instância
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
  @UseInterceptors(ValidateResponseInterceptor)
  async getOrder(
    @Param('id') id: string,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    const token = authorizationHeader.split(' ')[1];
    try {
      const order = await this.orderService.getOrder(id, token);
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return new GetOrderResponseDto(order);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
