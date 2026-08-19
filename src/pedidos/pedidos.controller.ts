import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarPedidoDto } from './pedido.dto';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  criarPedido(@Body() dto: CriarPedidoDto) {
    return this.pedidosService.criarPedido(dto);
  }

  @Get(':id')
  buscarPedido(@Param('id') id: string) {
    return this.pedidosService.buscarPedido(id);
  }
}
