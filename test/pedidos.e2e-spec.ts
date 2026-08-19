import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PedidosController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /pedidos', () => {
    it('deve criar pedido com body válido e retornar 201', async () => {
      const body = {
        productId: 'prod-001',
        customerId: 'cust-001',
        correlationId: `corr-${Date.now()}-valid`,
      };

      const response = await request(app.getHttpServer())
        .post('/pedidos')
        .send(body)
        .expect(201);

      expect(response.body).toMatchObject({
        pedidoId: expect.any(String),
        productId: body.productId,
        customerId: body.customerId,
        correlationId: body.correlationId,
        status: 'criado',
      });
      expect(response.body.pedidoId).toBeTruthy();
    });

    it('deve retornar o mesmo pedidoId para o mesmo correlationId (idempotência)', async () => {
      const correlationId = `corr-idempotency-${Date.now()}`;
      const body = {
        productId: 'prod-002',
        customerId: 'cust-002',
        correlationId,
      };

      const response1 = await request(app.getHttpServer())
        .post('/pedidos')
        .send(body)
        .expect(201);

      const response2 = await request(app.getHttpServer())
        .post('/pedidos')
        .send(body)
        .expect(201);

      expect(response1.body.pedidoId).toEqual(response2.body.pedidoId);
    });

    it('deve retornar 422 quando productId está ausente', async () => {
      const body = {
        customerId: 'cust-003',
        correlationId: `corr-no-product-${Date.now()}`,
      };

      await request(app.getHttpServer())
        .post('/pedidos')
        .send(body)
        .expect(422);
    });

    it('deve retornar 422 quando productId está vazio', async () => {
      const body = {
        productId: '',
        customerId: 'cust-004',
        correlationId: `corr-empty-product-${Date.now()}`,
      };

      await request(app.getHttpServer())
        .post('/pedidos')
        .send(body)
        .expect(422);
    });
  });

  describe('GET /pedidos/:id', () => {
    it('deve retornar 200 com pedido existente', async () => {
      const correlationId = `corr-get-${Date.now()}`;
      const body = {
        productId: 'prod-003',
        customerId: 'cust-005',
        correlationId,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/pedidos')
        .send(body)
        .expect(201);

      const { pedidoId } = createResponse.body;

      const getResponse = await request(app.getHttpServer())
        .get(`/pedidos/${pedidoId}`)
        .expect(200);

      expect(getResponse.body).toMatchObject({
        pedidoId,
        productId: body.productId,
        customerId: body.customerId,
        correlationId: body.correlationId,
        status: 'criado',
      });
    });

    it('deve retornar 404 para pedido inexistente', async () => {
      await request(app.getHttpServer())
        .get('/pedidos/pedido-nao-existe-999')
        .expect(404);
    });
  });
});
