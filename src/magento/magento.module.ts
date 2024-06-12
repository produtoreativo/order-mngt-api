import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MagentoService } from './magento.service';

@Module({
  imports: [HttpModule],
  providers: [MagentoService],
  exports: [MagentoService],
})
export class MagentoModule {}
