import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { CryptoService } from 'src/crypto/crypto.service';

@Module({
  imports: [PrismaModule],
  controllers: [WalletController],
  providers: [WalletService, CryptoService],
})
export class WalletModule {}
