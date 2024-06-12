import { Injectable } from '@nestjs/common';
import { MagentoService } from '../magento/magento.service';

@Injectable()
export class PaymentService {
  constructor(private readonly magentoService: MagentoService) {}

  async setPaymentMethod(token: string, method: string): Promise<string> {
    return await this.magentoService.setPaymentMethod(token, { method });
  }
}
