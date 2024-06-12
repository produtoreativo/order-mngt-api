import axios from 'axios';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MagentoService {
  private magentoUrl: string;

  constructor(private configService: ConfigService) {
    this.magentoUrl = this.configService.get<string>('MAGENTO_URL');
  }

  async addItemToCart(
    token: string,
    quote_id: string,
    sku: string,
    qty: number,
  ): Promise<any> {
    const url = `${this.magentoUrl}/rest/V1/carts/mine/items`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const data = {
      cartItem: {
        sku,
        qty,
        quote_id,
      },
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error('Failed to add item to cart: ' + error.message);
    }
  }

  async setShippingMethod(
    token: string,
    billingAddress: any,
    shippingAddress: any,
    methodCode: string,
    carrierCode: string,
  ): Promise<any> {
    const url = `${this.magentoUrl}/rest/V1/carts/mine/shipping-information`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const data = {
      address_information: {
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        shipping_carrier_code: carrierCode,
        shipping_method_code: methodCode,
      },
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error('Failed to set shipping method: ' + error.message);
    }
  }

  async setPaymentMethod(token: string, paymentMethod: any): Promise<any> {
    const url = `${this.magentoUrl}/rest/V1/carts/mine/payment-information`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const data = {
      payment_method: paymentMethod,
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error('Failed to set payment method: ' + error.message);
    }
  }

  async createCart(token: string): Promise<string> {
    const url = `${this.magentoUrl}/rest/V1/carts/mine`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(url, {}, { headers });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create cart: ' + error.message);
    }
  }

  async getUserDetails(token: string): Promise<any> {
    const url = `${this.magentoUrl}/rest/V1/customers/me`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user details: ' + error.message);
    }
  }

  async getOrderById(id: string, token: string): Promise<any> {
    const url = `${this.magentoUrl}/rest/V1/orders/${id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new NotFoundException('Order not found');
      }
      throw new InternalServerErrorException(
        'Failed to fetch order details: ' + error.message,
      );
    }
  }
}
