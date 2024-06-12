import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { MagentoModule } from '../magento/magento.module';

@Module({
  imports: [MagentoModule],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
