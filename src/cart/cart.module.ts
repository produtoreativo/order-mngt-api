import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { MagentoModule } from '../magento/magento.module';

@Module({
  imports: [MagentoModule],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
