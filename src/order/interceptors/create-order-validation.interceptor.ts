import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class CreateOrderValidationInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const createOrderDto = plainToInstance(CreateOrderDto, request.body);
    const errors = await validate(createOrderDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Validação da flag de endereço
    if (!createOrderDto.use_default_address) {
      if (!createOrderDto.billing_address) {
        throw new BadRequestException(
          'Billing address is required when use_default_address is false or not provided',
        );
      }
      if (!createOrderDto.shipping_address) {
        throw new BadRequestException(
          'Shipping address is required when use_default_address is false or not provided',
        );
      }
    }

    return next.handle().pipe(tap(() => console.log('Validation completed')));
  }
}
