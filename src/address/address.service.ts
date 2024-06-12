import { Injectable } from '@nestjs/common';
import { MagentoService } from '../magento/magento.service';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';

@Injectable()
export class AddressService {
  constructor(private readonly magentoService: MagentoService) {}

  private async getUserAddresses(token: string): Promise<any> {
    const userDetails = await this.magentoService.getUserDetails(token);
    if (!userDetails.addresses || userDetails.addresses.length === 0) {
      throw new Error('No default addresses found for user.');
    }
    return userDetails.addresses;
  }

  async getAddresses(
    createOrderDto: CreateOrderDto,
    token: string,
  ): Promise<{ billingAddress: any; shippingAddress: any }> {
    let { billing_address, shipping_address } = createOrderDto;

    const use_default_address = createOrderDto.use_default_address;

    if (use_default_address) {
      const userAddresses = await this.getUserAddresses(token);
      if (!userAddresses || userAddresses.length === 0) {
        throw new Error('No default addresses found for user.');
      }

      billing_address = userAddresses.find(
        (address: any) => address.default_billing,
      );
      shipping_address = userAddresses.find(
        (address: any) => address.default_shipping,
      );

      if (!shipping_address) {
        throw new Error('No default shipping address found for user.');
      }
    }

    if (!billing_address || !shipping_address) {
      throw new Error('Billing or shipping address is missing.');
    }

    return {
      billingAddress: billing_address,
      shippingAddress: shipping_address,
    };
  }
}
