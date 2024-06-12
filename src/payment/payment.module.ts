import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MagentoModule } from '../magento/magento.module';

@Module({
  imports: [MagentoModule],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
