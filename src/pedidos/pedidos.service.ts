import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarPedidoDto, Pedido } from './pedido.dto';

@Injectable()
export class PedidosService {
  private readonly logger = new Logger(PedidosService.name);

  // store por correlationId para idempotência
  private readonly storeByCorrelationId = new Map<string, Pedido>();
  // store por pedidoId para busca por ID
  private readonly storeByPedidoId = new Map<string, Pedido>();

  criarPedido(dto: CriarPedidoDto): Pedido {
    // Idempotência: retorna pedido existente se correlationId já foi usado
    if (this.storeByCorrelationId.has(dto.correlationId)) {
      const pedidoExistente = this.storeByCorrelationId.get(dto.correlationId);
      this.logger.log(
        `pedido.recebido correlationId=${dto.correlationId} pedidoId=${pedidoExistente.pedidoId} (idempotente)`,
      );
      return pedidoExistente;
    }

    const pedidoId = crypto.randomUUID();
    const pedido: Pedido = {
      pedidoId,
      productId: dto.productId,
      customerId: dto.customerId,
      correlationId: dto.correlationId,
      status: 'criado',
    };

    this.storeByCorrelationId.set(dto.correlationId, pedido);
    this.storeByPedidoId.set(pedidoId, pedido);

    this.logger.log(
      `pedido.criado pedidoId=${pedidoId} correlationId=${dto.correlationId}`,
    );
    this.logger.log(
      `pedido.recebido pedidoId=${pedidoId} correlationId=${dto.correlationId}`,
    );

    return pedido;
  }

  buscarPedido(id: string): Pedido {
    const pedido = this.storeByPedidoId.get(id);
    if (!pedido) {
      throw new NotFoundException(`Pedido ${id} não encontrado`);
    }
    return pedido;
  }
}
