import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Headers,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthInterceptor } from 'src/interceptors/auth.interceptor';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@UseInterceptors(AuthInterceptor)
@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto, description: 'Order data' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid order data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createOrder(
    @Body() orderDto: CreateOrderDto,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    this.logger.log(`Authorization header received: ${authorizationHeader}`);

    if (!authorizationHeader) {
      this.logger.error('Authorization header is missing');
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      this.logger.error('Invalid authorization header');
      throw new UnauthorizedException('Invalid authorization header');
    }

    try {
      const order = await this.orderService.createOrder(orderDto, token);
      if (!order) {
        throw new BadRequestException('Failed to create order');
      }
      return order;
    } catch (error) {
      this.logger.error(`Error creating order: ${error.message}`);
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
    type: CreateOrderDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOrder(
    @Param('id') id: string,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    this.logger.log(`Authorization header received: ${authorizationHeader}`);

    /*     if (!authorizationHeader) {
      this.logger.error('Authorization header is missing');
      throw new UnauthorizedException('Authorization header is missing');
    } */

    const [bearer, token] = authorizationHeader.split(' ');
    /*     if (bearer !== 'Bearer' || !token) {
      this.logger.error('Invalid authorization header');
      throw new UnauthorizedException('Invalid authorization header');
    } */

    try {
      const order = await this.orderService.getOrder(id, token);
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return order;
    } catch (error) {
      this.logger.error(`Error retrieving order: ${error.message}`);
      throw new NotFoundException(error.message);
    }
  }
}
