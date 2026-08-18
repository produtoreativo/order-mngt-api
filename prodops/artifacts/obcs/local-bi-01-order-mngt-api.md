# Local OBC — BI-01: Compra de 1 item por Pix via Listagem

**Produto:** order-mngt-api (Gerenciamento de Pedidos)
**Global OBC:** [global-bi-01-compra-pix-listagem.md](https://github.com/produtoreativo/prodops-portfolio/blob/prodops-workspace/prodops/artifacts/obcs/global-bi-01-compra-pix-listagem.md)
**Release:** 1.0.0
**Portfolio Issue:** [prodops-portfolio#5](https://github.com/produtoreativo/prodops-portfolio/issues/5)

---

## Status

Draft. Aguardando refinamento pelo Tech Lead. Rastreado em [order-mngt-api#11](https://github.com/produtoreativo/order-mngt-api/issues/11).

---

## Business Outcome

O order-mngt-api processa a criação e o recebimento de pedidos garantindo que cada pedido seja criado exatamente uma vez, rastreado por correlationId e confirmado ao webshop-api. É o ponto de verdade do estado do pedido na plataforma.

### Em linguagem executiva

É o caixa da loja: registra a venda, garante que o mesmo item não seja cobrado duas vezes por erro técnico, e confirma ao gerente (webshop-api) que a venda foi registrada.

---

## Observable Events

| Event | Meaning | Required dimensions |
|---|---|---|
| `pedido.criado` | Pedido registrado com sucesso | `pedidoId`, `productId`, `customerId`, `correlationId` |
| `pedido.recebido` | Pedido processado internamente após criação | `pedidoId`, `correlationId` |
| `pedido.criacao_falhou` | Falha ao registrar o pedido | `reason`, `correlationId` |
| `pedido.duplicado_ignorado` | Retentativa com mesmo correlationId — pedido já existia | `pedidoId`, `correlationId` |

---

## Initial SLIs

| SLI | Initial target |
|---|---|
| `POST /pedidos` com mesmo correlationId retorna o mesmo pedido (idempotência) | 100% |
| `pedido.recebido` emitido para todo `pedido.criado` | 100% |
| `POST /pedidos` responde em menos de 600ms (p95) | 99% |
| Pedido não criado em caso de productId inválido | 100% |

---

## Reliability Rules

- Idempotência obrigatória: duas chamadas com o mesmo correlationId resultam no mesmo pedidoId sem criar novo registro.
- Validar productId antes de persistir; rejeitar com 422 se inválido — nunca criar pedido com produto inexistente.
- Em falha transiente de persistência, retornar 503; nunca confirmar criação de pedido que não foi persistido.
- O evento `pedido.recebido` é emitido somente após persistência confirmada.
- Nenhum dado de pagamento é armazenado neste serviço — a Release 1.0 não tem pagamento.

---

## Response Contract

```json
{
  "pedidoId": "uuid",
  "productId": "string",
  "customerId": "string",
  "status": "CRIADO",
  "criadoEm": "ISO8601",
  "correlationId": "uuid"
}
```

---

## Related Artifacts

- BDD: `prodops/artifacts/bdd/bi-01-criar-receber-pedido.feature` *(a criar)*
- Iteration Plan: `prodops/artifacts/plans/iteration-plan.md`
- OBCs relacionados: [local-bi-01-webshop-api](https://github.com/produtoreativo/webshop-api/blob/prodops-workspace/prodops/artifacts/obcs/local-bi-01-webshop-api.md) (consumidor)
