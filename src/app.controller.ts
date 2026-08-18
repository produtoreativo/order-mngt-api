import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import OrderDto from './OrderDto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('order')
  async createOrder(@Body() orderDto: OrderDto) {
    return await this.appService.createOrder(orderDto);
  }

  @Post('order-group')
  @ApiResponse({
    status: 200,
    type: OrderDto,
    description: 'Pedido criado para compra em grupo',
  })
  async createOrderGroup(@Body() orderDto: OrderDto) {
    return await this.appService.createOrderGroup(orderDto);
  }

  @Get('offer/:id')
  @ApiResponse({
    status: 200,
    type: OrderDto,
    description: 'Carrinho atual do usuário',
  })
  async getOffer(@Param('id') id: string) {
    return {};
  }

  @Get('order/:id')
  async getOrder(@Param('id') id: string) {
    return await this.appService.getOrder(id);
  }
}
