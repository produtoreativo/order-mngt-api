import { Module } from '@nestjs/common';
import { MagentoModule } from '../magento/magento.module';
import { ShippingService } from './shipping.service';

@Module({
  imports: [MagentoModule],
  providers: [ShippingService],
  exports: [ShippingService],
})
export class ShippingModule {}
