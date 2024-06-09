import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MagentoService } from '../magento/magento.service';
import { AuthValidationInterceptor } from './interceptors/auth-validation.interceptor';
import { TransformResponseInterceptor } from '../interceptors/transform-response.interceptor';

@Module({
  imports: [HttpModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    MagentoService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: AuthValidationInterceptor,
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: TransformResponseInterceptor,
    },
  ],
  exports: [OrderService, MagentoService],
})
export class OrderModule {}
