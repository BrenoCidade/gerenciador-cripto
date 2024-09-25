import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './module/wallet/wallet.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'prisma/prisma.module';
import { CryptoModule } from './crypto/crypto.module';
import { UserModule } from './module/user/user.module'; 
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role/roles.guard';
import { AssetModule } from './module/asset/asset.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    WalletModule,
    PrismaModule,
    CryptoModule,
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    AssetModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers:[],
})
export class AppModule {}
