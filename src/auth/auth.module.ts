import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
