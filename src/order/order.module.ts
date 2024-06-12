import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { HttpModule } from '@nestjs/axios';
import { AddressService } from '../address/address.service';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';
import { ShippingService } from '../shipping/shipping.service';
import { MagentoModule } from '../magento/magento.module';

@Module({
  imports: [HttpModule, MagentoModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    AddressService,
    CartService,
    PaymentService,
    ShippingService,
  ],
})
export class OrderModule {}
