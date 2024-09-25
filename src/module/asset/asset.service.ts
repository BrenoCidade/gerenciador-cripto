import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Asset } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AssetService {
    private readonly logger = new Logger(AssetService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) { }

    async createAsset(createAssetDto: CreateAssetDto): Promise<Asset> {
        const { walletId, ...assetData } = createAssetDto;

        const currentPrice = await this.fetchCurrentPriceFromApi(assetData.symbol.toLowerCase());

        const totalValue = assetData.balance * currentPrice;

        return await this.prisma.asset.create({
            data: {
                ...assetData,
                wallet: {
                    connect: { id: walletId },
                },
                currentPrice: currentPrice,
                totalValue: totalValue,
            },
        });
    }

    async findAllAssets(): Promise<Asset[]> {
        const assets = await this.prisma.asset.findMany();

        // Atualizar o preço e o valor total antes de retornar
        const updatedAssets = await Promise.all(
            assets.map(async (asset) => {
                let currentPrice = asset.currentPrice;

                // Se o currentPrice estiver null, buscar da API
                if (!currentPrice) {
                    currentPrice = await this.fetchCurrentPriceFromApi(asset.name.toLowerCase());

                    // Atualizar o asset com o preço e valor total
                    const totalValue = asset.balance * currentPrice;
                    await this.prisma.asset.update({
                        where: { id: asset.id },
                        data: {
                            currentPrice,
                            totalValue,
                        },
                    });
                }

                // Retornar o asset atualizado
                return {
                    ...asset,
                    currentPrice,
                    totalValue: asset.balance * currentPrice,
                };
            })
        );

        return updatedAssets;
    }

    async findAssetById(assetId: string): Promise<Asset> {
        const asset = await this.prisma.asset.findUnique({
            where: { id: assetId },
        });

        if (!asset) {
            throw new NotFoundException(`Asset with id ${assetId} not found`);
        }
        return asset;
    }

    async updateAsset(assetId: string, updateAssetDto: UpdateAssetDto): Promise<Asset> {
        const existingAsset = await this.prisma.asset.findUnique({
            where: { id: assetId },
        });

        if (!existingAsset) {
            throw new NotFoundException(`Asset with id ${assetId} not found`);
        }

        return this.prisma.asset.update({
            where: { id: assetId },
            data: updateAssetDto,
        });
    }

    async deleteAsset(assetId: string) {
        const existingAsset = await this.prisma.asset.findUnique({
            where: { id: assetId },
        });

        if (!existingAsset) {
            throw new NotFoundException(`Asset with id ${assetId} not found`);
        }

        return this.prisma.asset.delete({
            where: { id: assetId },
        });
    }

    async fetchCurrentPriceFromApi(name: string): Promise<number | null> {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${name}&vs_currencies=usd`;

        try {
            const response = await firstValueFrom(this.httpService.get(url));

            if (response.data[name] && response.data[name].usd) {
                return response.data[name].usd;
            } else {
                console.error(`Preço não encontrado para o símbolo: ${name}`);
                return null;
            }
        } catch (error) {
            console.error(`Erro ao buscar preço para o símbolo: ${name}`, error);
            return null;
        }
    }

    async updateCurrentPrice(assetId: string) {
        const asset = await this.findAssetById(assetId);

        const currentPrice = await this.fetchCurrentPriceFromApi(asset.name.toLowerCase());

        return this.prisma.asset.update({
            where: { id: assetId },
            data: {
                currentPrice,
                totalValue: asset.balance * currentPrice,
            }
        });
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async updateAllPrices() {
        this.logger.log('Atualizando preços de todos os ativos...');

        const assets = await this.prisma.asset.findMany();

        for (const asset of assets) {
            try {
                await this.updateCurrentPrice(asset.id);
                this.logger.log(`Preço do ativo ${asset.name} atualizado com sucesso.`);
            } catch (error) {
                this.logger.error(
                    `Erro ao atualizar o preço do ativo ${asset.name}: ${error.message}`,
                );
            }
        }
    }
}
