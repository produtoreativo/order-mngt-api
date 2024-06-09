import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { MagentoService } from '../magento/magento.service';
import { CreateOrderDto, CreateOrderResponseDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private magentoService: MagentoService) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    token: string,
  ): Promise<any> {
    const cartId = await this.createCart(token);
    await this.addItemsToCart(createOrderDto.items, token, cartId);

    const { billingAddress, shippingAddress } = await this.getAddresses(
      createOrderDto,
      token,
    );

    await this.setShippingMethod(
      token,
      cartId,
      billingAddress,
      shippingAddress,
      createOrderDto.shipping_method.method_code,
      createOrderDto.shipping_method.carrier_code,
    );

    const orderId = await this.setPaymentMethod(
      token,
      createOrderDto.payment_method.method,
    );

    return new CreateOrderResponseDto(orderId);
  }

  private async createCart(token: string): Promise<string> {
    const cartId = await this.magentoService.createCart(token);
    if (!cartId) {
      throw new BadRequestException('Failed to create cart');
    }
    return cartId;
  }

  private async addItemsToCart(
    items: any[],
    token: string,
    cartId: string,
  ): Promise<void> {
    for (const item of items) {
      const addItemResponse = await this.magentoService.addItemToCart(
        token,
        cartId,
        item.sku,
        item.qty,
      );
      if (!addItemResponse) {
        throw new BadRequestException('Failed to add item to cart');
      }
    }
  }

  private async getAddresses(
    createOrderDto: CreateOrderDto,
    token: string,
  ): Promise<{ billingAddress: any; shippingAddress: any }> {
    let { billing_address, shipping_address } = createOrderDto;

    const use_default_address = createOrderDto.use_default_address;

    if (use_default_address) {
      const userDetails = await this.magentoService.getUserDetails(token);
      if (!userDetails.addresses || userDetails.addresses.length === 0) {
        throw new BadRequestException('No default addresses found for user.');
      }

      billing_address = userDetails.addresses.find(
        (address: any) => address.default_billing,
      );
      shipping_address = userDetails.addresses.find(
        (address: any) => address.default_shipping,
      );

      if (!shipping_address) {
        throw new BadRequestException(
          'No default shipping address found for user.',
        );
      }
    }

    if (!billing_address || !shipping_address) {
      throw new BadRequestException('Billing or shipping address is missing.');
    }

    return {
      billingAddress: billing_address,
      shippingAddress: shipping_address,
    };
  }

  private async setShippingMethod(
    token: string,
    cartId: string,
    billingAddress: any,
    shippingAddress: any,
    methodCode: string,
    carrierCode: string,
  ): Promise<void> {
    const response = await this.magentoService.setShippingMethod(
      token,
      billingAddress,
      shippingAddress,
      methodCode,
      carrierCode,
    );
    if (!response) {
      throw new BadRequestException('Failed to set shipping method');
    }
  }

  private async setPaymentMethod(token: string, method: string): Promise<any> {
    const response = await this.magentoService.setPaymentMethod(token, {
      method,
    });
    if (!response) {
      throw new BadRequestException('Failed to set payment method');
    }
    return response;
  }

  async getOrder(id: string, token: string): Promise<any> {
    const order = await this.magentoService.getOrderById(id, token);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
