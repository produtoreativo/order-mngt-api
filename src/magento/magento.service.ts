import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MagentoService {
  private magentoUrl = process.env.MAGENTO_URL;
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
        quote_id: quote_id.toString(),
      },
    };
    console.log(
      `Adding item to cart with URL: ${url}, token: ${token}, and data: ${JSON.stringify(
        data,
      )}`,
    );
    const response = await axios.post(url, data, { headers });
    console.log('Item added to cart with response:', response.data);
    return response.data;
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
    console.log(
      `Setting shipping method with URL: ${url}, token: ${token}, and data: ${JSON.stringify(
        data,
      )}`,
    );

    try {
      const response = await axios.post(url, data, { headers });
      console.log('Shipping method set with response:', response.data);
      return response.data;
    } catch (error) {
      console.error('setShippingMethod - Detalhes do erro:', error);
      if (error.response) {
        console.error(
          `setShippingMethod - Erro na resposta da API: Status ${error.response.status}`,
          error.response.data,
        );
        throw new Error(
          error.response.data.message || 'Erro na resposta da API',
        );
      } else {
        console.error('setShippingMethod - Erro na requisição:', error.message);
        throw new Error('Erro na requisição para a API Magento');
      }
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
    console.log(
      `Setting payment method with URL: ${url}, token: ${token}, and data: ${JSON.stringify(
        data,
      )}`,
    );
    const response = await axios.post(url, data, { headers });
    console.log('Payment method set with response:', response.data);
    return response.data;
  }

  async createCart(token: string): Promise<string> {
    const url = `${this.magentoUrl}/rest/V1/carts/mine`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    console.log(`Creating cart with URL: ${url} and token: ${token}`);
    const response = await axios.post(url, {}, { headers });
    console.log('Cart created with response:', response.data);
    return response.data;
  }
  async getUserDetails(token: string): Promise<any> {
    const url = `${this.magentoUrl}/rest/V1/customers/me`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    console.log(`Fetching user details with URL: ${url} and token: ${token}`);
    const response = await axios.get(url, { headers });
    console.log('User details fetched with response:', response.data);
    return response.data;
  }

  async getOrderById(id: string, token: string): Promise<any> {
    const url = `${this.magentoUrl}/rest/V1/orders/${id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    console.log(`Fetching order details with URL: ${url} and token: ${token}`);
    try {
      const response = await axios.get(url, { headers });
      console.log('Order details fetched with response:', response.data);
      return response.data;
    } catch (error) {
      console.error('getOrderById - Detalhes do erro:', error);
      if (error.response) {
        console.error(
          `getOrderById - Erro na resposta da API: Status ${error.response.status}`,
          error.response.data,
        );
        throw new Error(
          error.response.data.message || 'Erro na resposta da API',
        );
      } else {
        console.error('getOrderById - Erro na requisição:', error.message);
        throw new Error('Erro na requisição para a API Magento');
      }
    }
  }
}
