import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        customProps(req) {
          console.log('request', req.allLogs);
          // console.log('request', req);
          return {};
        },
      },
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    PedidosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
