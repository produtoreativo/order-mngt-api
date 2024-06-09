import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { validateSync } from 'class-validator';
import { GetOrderResponseDto } from '../order/dto/get-order-response.dto';

@Injectable()
export class ValidateResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const responseDto = new GetOrderResponseDto(response);
        const errors = validateSync(responseDto);

        if (errors.length > 0) {
          throw new InternalServerErrorException('Invalid response structure');
        }

        return response;
      }),
    );
  }
}
