import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MagentoService } from '../magento/magento.service';
import { CreateOrderDto, CreateOrderResponseDto } from './dto/create-order.dto';
import { GetOrderResponseDto } from './dto/get-order-response.dto';
import { AddressService } from './../address/address.service';
import { CartService } from '../cart/cart.service';
import { PaymentService } from 'src/payment/payment.service';
import { ShippingService } from 'src/shipping/shipping.service';

@Injectable()
export class OrderService {
  constructor(
    private magentoService: MagentoService,
    private addressService: AddressService,
    private cartService: CartService,
    private paymentService: PaymentService,
    private shippingService: ShippingService,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    token: string,
  ): Promise<CreateOrderResponseDto> {
    try {
      const cartId = await this.cartService.createCart(token);
      await this.cartService.addItemsToCart(
        createOrderDto.items,
        token,
        cartId,
      );

      const { billingAddress, shippingAddress } =
        await this.addressService.getAddresses(createOrderDto, token);

      await this.shippingService.setShippingMethod(
        token,
        billingAddress,
        shippingAddress,
        createOrderDto.shipping_method.method_code,
        createOrderDto.shipping_method.carrier_code,
      );

      const orderId = await this.paymentService.setPaymentMethod(
        token,
        createOrderDto.payment_method.method,
      );
      return new CreateOrderResponseDto(orderId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOrder(id: string, token: string): Promise<any> {
    try {
      const order = await this.magentoService.getOrderById(id, token);

      return new GetOrderResponseDto(order);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.statusCode === 404) {
        throw new NotFoundException('Order not found');
      }
      throw new InternalServerErrorException(
        'Failed to fetch order details: ' + error.message,
      );
    }
  }
}
