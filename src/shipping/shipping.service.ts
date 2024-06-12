import { Injectable } from '@nestjs/common';
import { MagentoService } from '../magento/magento.service';

@Injectable()
export class ShippingService {
  constructor(private readonly magentoService: MagentoService) {}

  async setShippingMethod(
    token: string,
    billingAddress: any,
    shippingAddress: any,
    methodCode: string,
    carrierCode: string,
  ): Promise<void> {
    await this.magentoService.setShippingMethod(
      token,
      billingAddress,
      shippingAddress,
      methodCode,
      carrierCode,
    );
  }
}
