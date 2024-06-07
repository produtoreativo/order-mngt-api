import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { MagentoService } from '../magento/magento.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private magentoService: MagentoService) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    token: string,
  ): Promise<any> {
    // Validação da flag de endereço
    if (!createOrderDto.use_default_address) {
      if (!createOrderDto.billing_address) {
        throw new BadRequestException(
          'Billing address is required when use_default_address is false or not provided',
        );
      }
      if (!createOrderDto.shipping_address) {
        throw new BadRequestException(
          'Shipping address is required when use_default_address is false or not provided',
        );
      }
    }

    console.log('Creating cart with token:', token);
    const cartId = await this.magentoService.createCart(token);
    if (!cartId) {
      throw new BadRequestException('Failed to create cart');
    }
    console.log('Cart created with ID:', cartId);

    for (const item of createOrderDto.items) {
      console.log('Adding item to cart:', item);
      const addItemResponse = await this.magentoService.addItemToCart(
        token,
        cartId,
        item.sku,
        item.quantity,
      );
      if (!addItemResponse) {
        throw new BadRequestException('Failed to add item to cart');
      }
      console.log('Item added to cart:', addItemResponse);
    }

    let billingAddress = createOrderDto.billing_address;
    let shippingAddress = createOrderDto.shipping_address;

    if (createOrderDto.use_default_address) {
      console.log('Fetching user details with token:', token);
      const userDetails = await this.magentoService.getUserDetails(token);
      if (!userDetails.addresses || userDetails.addresses.length === 0) {
        throw new BadRequestException('No default addresses found for user.');
      }

      if (!billingAddress) {
        billingAddress = userDetails.addresses.find(
          (address: any) => address.default_billing,
        );
      }

      if (!shippingAddress) {
        shippingAddress = userDetails.addresses.find(
          (address: any) => address.default_shipping,
        );
      }

      if (!shippingAddress) {
        throw new BadRequestException(
          'No default shipping address found for user.',
        );
      }
    }

    if (!billingAddress || !shippingAddress) {
      throw new BadRequestException('Billing or shipping address is missing.');
    }

    console.log('Setting shipping method with cart ID:', cartId);
    const setShippingMethodResponse =
      await this.magentoService.setShippingMethod(
        token,
        billingAddress,
        shippingAddress,
        createOrderDto.shipping_method.method_code,
        createOrderDto.shipping_method.carrier_code,
      );
    if (!setShippingMethodResponse) {
      throw new BadRequestException('Failed to set shipping method');
    }
    console.log('Shipping method set:', setShippingMethodResponse);

    console.log('Setting payment method with cart ID:', cartId);
    const setPaymentMethodResponse = await this.magentoService.setPaymentMethod(
      token,
      { method: createOrderDto.payment_method.method },
    );
    if (!setPaymentMethodResponse) {
      throw new BadRequestException('Failed to set payment method');
    }
    console.log('Payment method set:', setPaymentMethodResponse);

    // https://developer.adobe.com/commerce/webapi/rest/tutorials/orders/order-create-order/
    //
    // console.log('Placing order with cart ID:', cartId);
    // const order = await this.magentoService.placeOrder(token, cartId);
    // if (!order) {
    //   throw new BadRequestException('Failed to place order');
    // }
    // console.log('Order placed:', order);

    return setPaymentMethodResponse;
  }

  async getOrder(id: string, token: string): Promise<any> {
    const order = await this.magentoService.getOrderById(id, token);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
