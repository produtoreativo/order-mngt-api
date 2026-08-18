import { ApiProperty } from '@nestjs/swagger';

class OrderDto {
  @ApiProperty({
    example: 'coca-cola',
    description: 'SKU para o Magento',
  })
  sku: string;
  @ApiProperty({
    example: 'token123',
    description: 'Token de autenticação',
  })
  token: string;
  @ApiProperty({
    example: 'user#1245',
    description: 'ID do usuário',
  })
  userId: string;
}

export default OrderDto;
