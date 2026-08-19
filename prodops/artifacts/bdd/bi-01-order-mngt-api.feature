# language: pt
Funcionalidade: Gerenciamento de Pedidos — BI-01
  Como o webshop-api
  Quero criar e consultar pedidos no order-mngt-api
  Para que cada pedido seja processado exatamente uma vez, rastreado por correlationId e confirmado

  Contexto:
    Dado que o order-mngt-api está disponível na porta 3002

  Cenário: Criar pedido com dados válidos
    Dado que envio POST /pedidos com productId "prod-001", customerId "cust-001" e correlationId "corr-001"
    Então a resposta deve ter status 201
    E o corpo deve conter pedidoId não vazio
    E o corpo deve conter productId "prod-001"
    E o corpo deve conter customerId "cust-001"
    E o corpo deve conter correlationId "corr-001"
    E o corpo deve conter status "criado"

  Cenário: Idempotência — mesmo correlationId retorna o mesmo pedidoId
    Dado que envio POST /pedidos com productId "prod-002", customerId "cust-002" e correlationId "corr-idem-01"
    E guardo o pedidoId retornado
    Quando envio novamente POST /pedidos com o mesmo correlationId "corr-idem-01"
    Então a resposta deve ter status 201
    E o pedidoId retornado deve ser igual ao guardado

  Cenário: Rejeitar pedido sem productId — 422
    Dado que envio POST /pedidos sem o campo productId e correlationId "corr-sem-produto"
    Então a resposta deve ter status 422

  Cenário: Rejeitar pedido com productId vazio — 422
    Dado que envio POST /pedidos com productId "" e correlationId "corr-vazio"
    Então a resposta deve ter status 422

  Cenário: Consultar pedido existente
    Dado que criei um pedido com correlationId "corr-get-01" e obtive o pedidoId
    Quando envio GET /pedidos/:pedidoId
    Então a resposta deve ter status 200
    E o corpo deve conter os dados do pedido criado

  Cenário: Consultar pedido inexistente — 404
    Quando envio GET /pedidos/pedido-nao-existe-999
    Então a resposta deve ter status 404
