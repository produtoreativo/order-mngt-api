import { Injectable } from '@nestjs/common';
import { MagentoService } from '../magento/magento.service';

@Injectable()
export class CartService {
  constructor(private readonly magentoService: MagentoService) {}

  async createCart(token: string): Promise<string> {
    return await this.magentoService.createCart(token);
  }

  async addItemsToCart(
    items: any[],
    token: string,
    cartId: string,
  ): Promise<void> {
    for (const item of items) {
      await this.magentoService.addItemToCart(
        token,
        cartId,
        item.sku,
        item.qty,
      );
    }
  }
}
