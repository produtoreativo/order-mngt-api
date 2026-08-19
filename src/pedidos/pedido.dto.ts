import { IsNotEmpty, IsString } from 'class-validator';

export class CriarPedidoDto {
  @IsString()
  @IsNotEmpty({ message: 'productId não pode ser vazio' })
  productId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  correlationId: string;
}

export interface Pedido {
  pedidoId: string;
  productId: string;
  customerId: string;
  correlationId: string;
  status: 'criado';
}
