import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetOrderResponseDto } from '../order/dto/get-order-response.dto';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (response?.data) {
          console.log(`Order: ${JSON.stringify(response.data)}`);
          const orderResponse = new GetOrderResponseDto(response.data);
          return {
            data: orderResponse,
            timestamp: response.timestamp || new Date().toISOString(),
          };
        }

        return {
          data: response,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
