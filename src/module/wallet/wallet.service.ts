import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';
import { CryptoService } from 'src/crypto/crypto.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from '@prisma/client';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService, private cryptoService: CryptoService) {}

    async getAllWallets(userId: string): Promise<Wallet[]> {
        return this.prisma.wallet.findMany({
            where: {
                userId: {
                    equals: userId,
                },
            },
            include: {
                assets: true,
            }
        })
    }

    async getWalletById(walletId: string): Promise<Wallet | null> {
        const wallet =  await this.prisma.wallet.findUnique({
            where: { id: walletId },
            include: { assets: true},
        });

        if(!wallet) {
            throw new NotFoundException(`Wallet with ID ${walletId} not found`);
        }

        return wallet;
    }

    async createWallet(userId: string, createWalletDto: CreateWalletDto): Promise<Wallet> {
        const { address, blockchain } = createWalletDto;

        const existingWallet = await this.prisma.wallet.findUnique({
            where: { address },
        });

        if (existingWallet) {
            throw new Error('Wallet already exists with this address');
        }

        return this.prisma.wallet.create({
            data: {
                address,
                blockchain,
                userId,
            },
        });
    }

    async updateWallet(walletId: string, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
        const { address, blockchain } = updateWalletDto;

        const wallet = await this.prisma.wallet.findUnique({
            where: { id: walletId },
        });

        if (!wallet) {
            throw new NotFoundException(`Wallet with ID ${walletId} not found`);
        }

        return this.prisma.wallet.update({
            where: { id: walletId },
            data: {
                address,
                blockchain
            },
        });
    }

    async deleteWallet(walletId: string) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { id: walletId },
        });

        if (!wallet) {
            throw new NotFoundException(`Wallet with ID ${walletId} not found`);
        }

        return this.prisma.wallet.delete({
            where: { id: walletId},
        });
    }

    @Cron('0 * * * *')
    async updateAssetPrices() {
        const assets = await this.prisma.asset.findMany();

        for (const asset of assets) {
            const currentPrice = await this.cryptoService.getCryptoPrice(asset.symbol.toLowerCase());

            if (currentPrice) {
                await this.prisma.asset.update({
                    where: { id: asset.id},
                    data: {
                        currentPrice,
                        totalValue: asset.balance * currentPrice,
                    },
                });
            }
        }
    }
}
