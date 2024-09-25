import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Public } from 'src/auth/decorators/is-public.decorator';

@Public()
@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Post(':userId')
  async create(
    @Param('userId') userId: string,
    @Body() CreateWalletDto: CreateWalletDto
  ): Promise<Wallet> {
    return await this.walletService.createWallet(userId, CreateWalletDto);
  }

  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string): Promise<Wallet[]> {
    return await this.walletService.getAllWallets(userId);
  }

  @Get(':walletId')
  async findWalletById(@Param('walletId') walletId: string): Promise<Wallet> {
    return await this.walletService.getWalletById(walletId);
  }

  @Put(':walletId')
  async update(
    @Param('walletId') walletId: string,
    @Body() updateWalletDto: UpdateWalletDto
  ): Promise<Wallet> {
    return await this.walletService.updateWallet(walletId, updateWalletDto);
  }

  @Delete(':walletId')
  async delete(@Param('walletId') walletId: string) {
    return await this.walletService.deleteWallet(walletId);
  }
}
